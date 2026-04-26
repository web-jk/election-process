import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map';
import * as googleMapsLoader from '@googlemaps/js-api-loader';
import { ElementRef } from '@angular/core';
import * as firebaseAuth from 'firebase/auth';

// Prefix with vi_ for hoisting
const vi_mockDataLayer = {
  loadGeoJson: vi.fn(),
  setStyle: vi.fn(),
  addListener: vi.fn(),
  overrideStyle: vi.fn(),
  revertStyle: vi.fn()
};

const vi_mockMap = {
  data: vi_mockDataLayer
};

const vi_mockInfoWindow = {
  setContent: vi.fn(),
  setPosition: vi.fn(),
  open: vi.fn()
};

// Mock Google Maps Loader
vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn(async (name: string) => {
    if (name === 'maps') {
      return {
        Map: vi.fn().mockImplementation(function() { return vi_mockMap; }),
        InfoWindow: vi.fn().mockImplementation(function() { return vi_mockInfoWindow; }),
        ControlPosition: { RIGHT_TOP: 1 }
      };
    }
    if (name === 'core') return { Settings: {} };
    return {};
  })
}));

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth: any, cb: any) => cb(null)),
  signOut: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn()
}));

// Mock global fetch
(window as any).fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({
    features: [
      { properties: { st_nm: 'Rajasthan' }, geometry: { type: 'Point', coordinates: [0, 0] } },
      { properties: { NAME_1: 'Delhi' }, geometry: { type: 'Point', coordinates: [0, 0] } }
    ]
  })
} as Response);

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup google global object
    (window as any).google = {
      maps: {
        ControlPosition: { RIGHT_TOP: 1 },
        SymbolPath: { CIRCLE: 0 },
        Marker: vi.fn().mockImplementation(function() { return {}; }),
        Map: vi.fn().mockImplementation(function() { return vi_mockMap; }),
        InfoWindow: vi.fn().mockImplementation(function() { return vi_mockInfoWindow; })
      }
    };

    await TestBed.configureTestingModule({
      imports: [MapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.mapContainer = new ElementRef(document.createElement('div'));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle help', () => {
    const initialHelp = component['showHelp']();
    component.toggleHelp();
    expect(component['showHelp']()).toBe(!initialHelp);
  });

  it('should initialize map in AfterViewInit', async () => {
    await component.ngAfterViewInit();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(googleMapsLoader.setOptions).toHaveBeenCalled();
    expect(vi_mockDataLayer.loadGeoJson).toHaveBeenCalled();
  });

  it('should cover setStyle and NAME_1 fallback', async () => {
    await component.ngAfterViewInit();
    await new Promise(resolve => setTimeout(resolve, 100));

    const styleFn = vi_mockDataLayer.setStyle.mock.calls[0][0];
    const mockFeatureStNm = { getProperty: vi.fn().mockImplementation((p) => p === 'st_nm' ? 'Rajasthan' : null) };
    const mockFeatureName1 = { getProperty: vi.fn().mockImplementation((p) => p === 'NAME_1' ? 'Delhi' : null) };
    
    styleFn(mockFeatureStNm);
    styleFn(mockFeatureName1);
    expect(mockFeatureName1.getProperty).toHaveBeenCalledWith('NAME_1');
  });

  it('should handle map events and UT fallback', async () => {
    await component.ngAfterViewInit();
    await new Promise(resolve => setTimeout(resolve, 100));

    const clickHandler = vi_mockDataLayer.addListener.mock.calls.find((c: any) => c[0] === 'click')![1];

    // Case 1: State match
    const mockEventState = {
      feature: { getProperty: vi.fn().mockReturnValue('Rajasthan') },
      latLng: { lat: 0, lng: 0 }
    };
    clickHandler(mockEventState);

    // Case 2: UT match (fallback)
    const mockEventUT = {
      feature: { getProperty: vi.fn().mockReturnValue('Delhi') },
      latLng: { lat: 0, lng: 0 }
    };
    clickHandler(mockEventUT);
    
    expect(vi_mockInfoWindow.setContent).toHaveBeenCalled();
  });

  it('should handle mouseover and mouseout', async () => {
    await component.ngAfterViewInit();
    await new Promise(resolve => setTimeout(resolve, 100));

    const mouseoverHandler = vi_mockDataLayer.addListener.mock.calls.find((c: any) => c[0] === 'mouseover')![1];
    const mouseoutHandler = vi_mockDataLayer.addListener.mock.calls.find((c: any) => c[0] === 'mouseout')![1];

    const mockEvent = {
      feature: { getProperty: vi.fn().mockReturnValue('Rajasthan') },
      latLng: { lat: 0, lng: 0 }
    };

    mouseoverHandler(mockEvent);
    expect(vi_mockDataLayer.overrideStyle).toHaveBeenCalled();

    mouseoutHandler(mockEvent);
    expect(vi_mockDataLayer.revertStyle).toHaveBeenCalled();
  });

  it('should normalize names correctly', () => {
    expect(component['normalize']('Andaman & Nicobar Islands')).toBe('andamanandnicobar');
    expect(component['normalize']('Arunanchal Pradesh')).toBe('arunachalpradesh');
    expect(component['normalize']('Dadara & Nagar Havelli')).toBe('dadraandnagarhaveli');
    expect(component['normalize']('Islands')).toBe('');
    expect(component['normalize']('')).toBe('');
    expect(component['normalize'](null as any)).toBe('');
  });

  it('should get correct colors for various states', () => {
    expect(component['getColor']('Rajasthan')).toBe('#00bcd4');
    expect(component['getColor']('Assam')).toBe('#ff9800');
    expect(component['getColor']('Maharashtra')).toBe('#2e7d32');
    expect(component['getColor']('Unknown')).toBe('#004d40');
  });

  it('should get state center', () => {
    expect(component['getStateCenter']('Rajasthan')).toEqual({ lat: 26.5, lng: 73.8 });
    expect(component['getStateCenter']('Unknown')).toEqual({ lat: 22.5937, lng: 78.9629 });
    expect(component['getStateCenter']('Telangana')).toEqual({ lat: 17.8, lng: 79.0 });
    expect(component['getStateCenter']('Andaman & Nicobar Island')).toEqual({ lat: 13.1, lng: 93.1 });
    expect(component['getStateCenter']('Dadara & Nagar Havelli')).toEqual({ lat: 20.2, lng: 73.0 });
  });

  it('should get state label data', () => {
    expect(component['getStateLabelData']('Rajasthan').displayName).toBe('Rajasthan');
    expect(component['getStateLabelData']('Andaman and Nicobar Islands').displayName).toBe('Andaman & Nicobar');
    expect(component['getStateLabelData']('Himachal Pradesh').displayName).toBe('H.P.');
    expect(component['getStateLabelData']('Dadra and Nagar Haveli and Daman and Diu').displayName).toBe('Dadra & Daman');
    expect(component['getStateLabelData']('Unknown').displayName).toBe('Unknown');
  });

  it('should add labels and handle duplicates', async () => {
    (component as any).map = vi_mockMap;
    await component['addLabels']();
    expect(window.google.maps.Marker).toHaveBeenCalled();
  });

  it('should handle errors in ngAfterViewInit', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (googleMapsLoader.importLibrary as any).mockRejectedValueOnce(new Error('Maps Load Error'));
    await component.ngAfterViewInit();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle auth state changes', () => {
    fixture.detectChanges();
    const cb = (firebaseAuth.onAuthStateChanged as any).mock.calls[0][1];
    cb({ displayName: 'John Doe' });
    expect(component['userName']()).toBe('John Doe');
    cb(null);
    expect(component['userName']()).toBe('Guest');
  });
});
