import { Component, AfterViewInit, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { electionData } from '../data';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit, OnInit {
  private map: L.Map | undefined;
  
  // Welcome and Help state
  protected userName = signal<string>('Guest');
  protected showHelp = signal<boolean>(true);

  ngOnInit() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        this.userName.set(user.displayName);
      } else {
        this.userName.set('Guest');
      }
    });
  }

  toggleHelp() {
    this.showHelp.set(!this.showHelp());
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: false, // We'll add it manually to bottom-right
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      touchZoom: true,
      bounceAtZoomLimits: false
    });

    // Add zoom controls to the bottom right
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    // No tile layer to show "only india map"

    fetch('/india_state.geojson')
      .then(res => res.json())
      .then(data => {
        if (this.map) {
          const geojsonLayer = L.geoJSON(data, {
            style: (feature) => this.getStyle(feature),
            onEachFeature: (feature, layer) => {
              const stateName = this.getStateName(feature);
              
              const sData = electionData.states.find(s => s.state === stateName) || 
                            electionData.union_territories.find(ut => ut.name === stateName);
              
              let popupContent = `<div style="padding: 5px;">
                <h3 style="margin: 0 0 10px 0; color: #1a73e8;">${stateName}</h3>`;
              
              if (feature.properties.district) {
                popupContent += `<p style="margin: 5px 0;"><strong>District:</strong> ${feature.properties.district}</p>`;
              }

              if (sData) {
                popupContent += `
                  <p style="margin: 5px 0;"><strong>Lok Sabha Seats:</strong> ${sData.lok_sabha_seats}</p>
                  <p style="margin: 5px 0;"><strong>Rajya Sabha Seats:</strong> ${sData.rajya_sabha_seats}</p>
                  <p style="margin: 5px 0;"><strong>Vidhan Sabha Seats:</strong> ${sData.vidhan_sabha_seats}</p>
                `;
              }
              
              popupContent += `</div>`;
              layer.bindPopup(popupContent);
              
              layer.on({
                mouseover: (e) => {
                  const l = e.target;
                  l.setStyle({ fillOpacity: 1, weight: 2 });
                },
                mouseout: (e) => {
                  const l = e.target;
                  geojsonLayer.resetStyle(l);
                }
              });
            }
          }).addTo(this.map);

          this.addLabels(data);
          const bounds = geojsonLayer.getBounds();
          this.map.fitBounds(bounds, { padding: [20, 20] });
          // Removed setMaxBounds to prevent snapping behavior when dragging
          // this.map.setMaxBounds(bounds.pad(0.5));
          
          // Initial scale
          this.updateLabelScale();
        }
      });

    // Listen to zoom changes to scale labels
    this.map.on('zoomend', () => this.updateLabelScale());
  }

  private updateLabelScale(): void {
    if (!this.map) return;
    const zoom = this.map.getZoom();
    const root = document.documentElement;
    // Scale font size: Zoom 5 -> 10px, Zoom 6 -> 13px, Zoom 7 -> 16px
    const baseSize = 5;
    const fontSize = Math.max(7, (zoom - baseSize) * 3 + 10);
    root.style.setProperty('--map-label-size', `${fontSize}px`);
    root.style.setProperty('--map-number-size', `${fontSize + 3}px`);
  }

  /** Get the state/UT name from a feature (new GeoJSON uses st_nm) */
  private getStateName(feature: any): string {
    return feature.properties.st_nm || feature.properties.NAME_1 || '';
  }

  private addLabels(data: any): void {
    const addedLabels = new Set<string>();

    // Group features by state to compute correct center across all districts
    const stateFeatures: { [key: string]: any[] } = {};
    data.features.forEach((feature: any) => {
      const stateName = this.getStateName(feature);
      if (!stateFeatures[stateName]) stateFeatures[stateName] = [];
      stateFeatures[stateName].push(feature);
    });

    Object.keys(stateFeatures).forEach(stateName => {
      if (addedLabels.has(stateName)) return;
      addedLabels.add(stateName);

      // Combine all features of this state to get the overall bounds center
      const featureCollection = {
        type: 'FeatureCollection' as const,
        features: stateFeatures[stateName]
      };
      const bounds = L.geoJSON(featureCollection as any).getBounds();
      const center = bounds.getCenter();
      const sData = this.getStateData(stateName);

      // Adjust center for specific states to avoid overlap or better alignment
      let labelCenter = center;
      if (stateName === 'West Bengal') labelCenter = L.latLng(center.lat, center.lng + 0.5);
      if (stateName === 'Andaman and Nicobar Islands') labelCenter = L.latLng(center.lat, center.lng + 1);
      if (stateName === 'Jammu and Kashmir') labelCenter = L.latLng(center.lat - 0.5, center.lng - 0.5);
      if (stateName === 'Ladakh') labelCenter = L.latLng(center.lat + 0.3, center.lng + 0.5);

      L.marker(labelCenter, {
        icon: L.divIcon({
          className: 'state-label',
          html: `<div class="label-content">${sData.seats !== undefined ? `<span class="seat-num">${sData.seats}</span>` : ''}<span class="state-nm">${sData.displayName}</span></div>`,
          iconSize: [100, 40],
          iconAnchor: [50, 20]
        }),
        interactive: false
      }).addTo(this.map!);
    });
  }

  private getStateData(stateName: string): { displayName: string, seats?: number } {
    const sData = electionData.states.find(s => s.state === stateName) || 
                  electionData.union_territories.find(ut => ut.name === stateName);
    
    let seats = sData?.lok_sabha_seats;

    const shortNames: { [key: string]: string } = {
      'Jammu and Kashmir': 'JK',
      'Ladakh': 'LA',
      'Himachal Pradesh': 'HP',
      'Punjab': 'PB',
      'Haryana': 'HR',
      'Uttarakhand': 'UK'
    };

    return { displayName: shortNames[stateName] || stateName, seats };
  }

  private getStyle(feature: any): any {
    const name = this.getStateName(feature);
    let color = '#a8d5ba'; // Default light green

    if (['Rajasthan', 'Gujarat'].includes(name)) color = '#4db6ac';
    else if (['Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Jharkhand', 'West Bengal'].includes(name)) color = '#1b5e20';
    else if (['Maharashtra', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Odisha', 'Chhattisgarh'].includes(name)) color = '#2e7d32';
    else if (['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'].includes(name)) color = '#ff9800';
    else if (['Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Punjab', 'Haryana', 'Uttarakhand', 'Delhi'].includes(name)) color = '#004d40';

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8
    };
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
