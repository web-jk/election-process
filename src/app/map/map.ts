import { Component, AfterViewInit, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { electionData } from '../data';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../firebase.config';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit, OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  private map: google.maps.Map | undefined;
  private infoWindow: google.maps.InfoWindow | undefined;
  
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

  async ngAfterViewInit(): Promise<void> {
    setOptions({
      key: firebaseConfig.apiKey,
      v: 'weekly'
    });

    try {
      // Use the recommended loading pattern from the documentation
      const { Settings } = await importLibrary('core') as any;
      const { Map, InfoWindow } = await importLibrary('maps') as google.maps.MapsLibrary;

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 21.7679, lng: 78.8718 },
        zoom: 5.2,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        styles: [
          {
            featureType: 'all',
            stylers: [{ visibility: 'off' }]
          }
        ],
        backgroundColor: '#e0ebed'
      };

      this.map = new Map(this.mapContainer.nativeElement, mapOptions);
      this.infoWindow = new InfoWindow();

      // Load State-only GeoJSON (v2 to break cache)
      this.map.data.loadGeoJson('/india_states_v2.geojson');

      // Style the Data Layer (Fine lines for a clean professional look)
      this.map.data.setStyle((feature: google.maps.Data.Feature) => {
        const stateName = (feature.getProperty('st_nm') || feature.getProperty('NAME_1')) as string;
        return {
          fillColor: this.getColor(stateName),
          strokeColor: '#ffffff',
          strokeWeight: 0.5, // Fine white lines
          fillOpacity: 1
        };
      });

      // Events
      this.map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
        this.map?.data.overrideStyle(event.feature, { 
          strokeWeight: 3, // Thicker highlight on hover
          strokeColor: '#ffffff'
        });
      });

      this.map.data.addListener('mouseout', (event: google.maps.Data.MouseEvent) => {
        this.map?.data.revertStyle();
      });

      this.map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
        const feature = event.feature;
        const stateName = (feature.getProperty('st_nm') || feature.getProperty('NAME_1')) as string;
        const normalizedClick = this.normalize(stateName);

        const sData = electionData.states.find(s => {
          const n = this.normalize(s.state);
          return n === normalizedClick || n.includes(normalizedClick) || normalizedClick.includes(n);
        }) || electionData.union_territories.find(ut => {
          const n = this.normalize(ut.name);
          return n === normalizedClick || n.includes(normalizedClick) || normalizedClick.includes(n);
        });

        let content = `
          <div style="padding: 16px; font-family: 'Outfit', sans-serif; min-width: 200px; color: #1a1a2e;">
            <h3 style="margin: 0 0 12px 0; color: #FF6B00; font-size: 20px; font-weight: 800; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">
              ${stateName}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #64748b;">Lok Sabha</span>
                <span style="font-weight: 800; background: #fff7ed; color: #ea580c; padding: 2px 8px; border-radius: 6px;">${sData?.lok_sabha_seats || 0}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #64748b;">Rajya Sabha</span>
                <span style="font-weight: 800; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 6px;">${sData?.rajya_sabha_seats || 0}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #64748b;">Vidhan Sabha</span>
                <span style="font-weight: 800; background: #f0fdf4; color: #16a34a; padding: 2px 8px; border-radius: 6px;">${sData?.vidhan_sabha_seats || 0}</span>
              </div>
            </div>
          </div>`;

        this.infoWindow?.setContent(content);
        this.infoWindow?.setPosition(event.latLng);
        this.infoWindow?.open(this.map);
      });

      // Add Labels
      this.addLabels();

    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  private getColor(name: string): string {
    if (!name) return '#004d40';
    
    let color = '#004d40'; // Default dark green
    const normalized = this.normalize(name);

    // Matching screenshot colors
    const tealStates = ['rajasthan', 'gujarat'];
    const orangeStates = ['arunanchalpradesh', 'arunachalpradesh', 'assam', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura', 'sikkim'];
    const lightGreenStates = [
      'maharashtra', 'karnataka', 'kerala', 'tamilnadu', 'andhrapradesh', 
      'telangana', 'goa', 'puducherry', 'lakshadweep', 'andamannicobar', 
      'chhattisgarh', 'odisha', 'dadara', 'dadra', 'daman'
    ];

    if (tealStates.some(s => normalized.includes(s))) color = '#00bcd4';
    else if (orangeStates.some(s => normalized.includes(s))) color = '#ff9800';
    else if (lightGreenStates.some(s => normalized.includes(s))) color = '#2e7d32'; 
    
    return color;
  }

  private normalize(name: string): string {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/arunanchal/g, 'arunachal') // Fix common typo in GeoJSON
      .replace(/dadara/g, 'dadra') // Fix common typo in GeoJSON
      .replace(/havelli/g, 'haveli') // Fix common typo in GeoJSON
      .replace(/[^a-z]/g, '') // Remove non-letters
      .replace(/islands?$/, '');
  }

  private async addLabels(): Promise<void> {
    const res = await fetch('/india_states_v2.geojson');
    const data = await res.json();
    
    const stateFeatures: { [key: string]: any[] } = {};
    data.features.forEach((feature: any) => {
      const stateName = feature.properties.st_nm || feature.properties.NAME_1;
      if (!stateFeatures[stateName]) stateFeatures[stateName] = [];
      stateFeatures[stateName].push(feature);
    });

    const addedLabels = new Set<string>();

    Object.keys(stateFeatures).forEach(stateName => {
      const sData = this.getStateLabelData(stateName);
      const center = this.getStateCenter(stateName);

      // Skip if stateName is null or empty
      if (!stateName || stateName === 'null') return;

      // Prevent duplicate labels for merged UTs (Dadra, Daman, Diu)
      const labelKey = sData.displayName;
      if (addedLabels.has(labelKey) && (labelKey.includes('Dadra') || labelKey.includes('Daman'))) return;
      addedLabels.add(labelKey);

      // Accessibility: White text with halos for maximum visibility
      new google.maps.Marker({
        position: center,
        map: this.map,
        label: {
          text: `${sData.seats !== undefined ? sData.seats + ' ' : ''}${sData.displayName}`,
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '800',
          className: 'map-label-text'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0
        },
        interactive: false,
        zIndex: 1000,
        title: stateName
      } as any);
    });
  }

  private getStateLabelData(stateName: string): { displayName: string, seats?: number } {
    const normalized = this.normalize(stateName);
    const sData = electionData.states.find(s => {
      const n = this.normalize(s.state);
      return n === normalized || n.includes(normalized) || normalized.includes(n);
    }) || electionData.union_territories.find(ut => {
      const n = this.normalize(ut.name);
      return n === normalized || n.includes(normalized) || normalized.includes(n);
    });
    
    // Use the clean name from our data if available, otherwise fallback to GeoJSON name
    const cleanName = sData ? (('state' in sData) ? sData.state : sData.name) : stateName;
    return { displayName: cleanName, seats: sData?.lok_sabha_seats };
  }

  private getStateCenter(stateName: string): google.maps.LatLngLiteral {
    const normalized = this.normalize(stateName);
    
    const centers: { [key: string]: google.maps.LatLngLiteral } = {
      'rajasthan': { lat: 26.5, lng: 73.8 },
      'madhyapradesh': { lat: 23.5, lng: 78.2 },
      'maharashtra': { lat: 19.5, lng: 76.0 },
      'uttarpradesh': { lat: 27.2, lng: 80.8 }, 
      'gujarat': { lat: 22.2, lng: 71.5 },
      'karnataka': { lat: 14.8, lng: 76.0 }, 
      'andhrapradesh': { lat: 15.8, lng: 79.8 }, 
      'odisha': { lat: 20.5, lng: 84.5 },
      'chhattisgarh': { lat: 21.2, lng: 81.8 },
      'tamilnadu': { lat: 10.8, lng: 78.5 },
      'telangana': { lat: 17.8, lng: 79.0 },
      'bihar': { lat: 25.8, lng: 85.5 }, 
      'westbengal': { lat: 24.2, lng: 87.8 }, 
      'arunanchalpradesh': { lat: 28.0, lng: 94.5 },
      'arunachalpradesh': { lat: 28.0, lng: 94.5 },
      'jharkhand': { lat: 23.6, lng: 85.2 }, 
      'assam': { lat: 26.2, lng: 92.5 }, 
      'himachalpradesh': { lat: 31.8, lng: 77.2 }, 
      'jammuandkashmir': { lat: 34.0, lng: 74.5 },
      'jammukashmir': { lat: 34.0, lng: 74.5 },
      'uttarakhand': { lat: 30.2, lng: 79.2 },
      'punjab': { lat: 31.0, lng: 75.5 }, 
      'haryana': { lat: 29.2, lng: 76.2 }, 
      'kerala': { lat: 10.5, lng: 76.5 }, 
      'meghalaya': { lat: 25.5, lng: 91.2 }, 
      'manipur': { lat: 24.7, lng: 93.9 }, 
      'mizoram': { lat: 23.2, lng: 92.9 }, 
      'nagaland': { lat: 26.1, lng: 94.5 }, 
      'tripura': { lat: 23.8, lng: 91.8 }, 
      'sikkim': { lat: 27.5, lng: 88.5 },
      'goa': { lat: 15.3, lng: 74.0 }, 
      'delhi': { lat: 28.6, lng: 77.2 }, 
      'nctofdelhi': { lat: 28.6, lng: 77.2 },
      'ladakh': { lat: 34.2, lng: 77.5 },
      'lakshadweep': { lat: 10.5, lng: 72.5 },
      'andamannicobar': { lat: 11.7, lng: 92.7 },
      'puducherry': { lat: 11.9, lng: 79.8 },
      'chandigarh': { lat: 30.7, lng: 76.8 },
      'dadaranagarhavelli': { lat: 20.2, lng: 73.0 },
      'damandiu': { lat: 20.4, lng: 72.8 }
    };

    // Try to match normalized names
    for (const key in centers) {
      if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
        return centers[key];
      }
    }

    // Secondary fallback for common variations
    if (normalized.includes('dadra') || normalized.includes('haveli')) return centers['dadaranagarhavelli'];
    if (normalized.includes('daman') || normalized.includes('diu')) return centers['damandiu'];
    if (normalized.includes('andaman')) return centers['andamannicobar'];
    if (normalized.includes('delhi')) return centers['nctofdelhi'];

    return { lat: 22.5937, lng: 78.9629 };
  }
}
