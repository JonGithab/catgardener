import { useState, useEffect, useCallback } from 'react';

export interface HardinessZone {
  zone: string;
  minTemp: number;
  maxTemp: number;
  description: string;
}

// USDA Hardiness Zone data based on minimum annual temperature
const ZONE_DATA: HardinessZone[] = [
  { zone: '1', minTemp: -60, maxTemp: -50, description: 'Extreme cold, very short growing season' },
  { zone: '2', minTemp: -50, maxTemp: -40, description: 'Very cold, limited plant selection' },
  { zone: '3', minTemp: -40, maxTemp: -30, description: 'Cold winters, hardy perennials thrive' },
  { zone: '4', minTemp: -30, maxTemp: -20, description: 'Cold climate, good for cool-season crops' },
  { zone: '5', minTemp: -20, maxTemp: -10, description: 'Moderate cold, wide plant variety' },
  { zone: '6', minTemp: -10, maxTemp: 0, description: 'Mild winters, long growing season' },
  { zone: '7', minTemp: 0, maxTemp: 10, description: 'Warm climate, many plant options' },
  { zone: '8', minTemp: 10, maxTemp: 20, description: 'Mild, year-round gardening possible' },
  { zone: '9', minTemp: 20, maxTemp: 30, description: 'Warm, tropical plants thrive' },
  { zone: '10', minTemp: 30, maxTemp: 40, description: 'Hot climate, frost-free' },
  { zone: '11', minTemp: 40, maxTemp: 50, description: 'Tropical, no frost' },
  { zone: '12', minTemp: 50, maxTemp: 60, description: 'Tropical paradise' },
  { zone: '13', minTemp: 60, maxTemp: 70, description: 'Extreme tropical' },
];

// Simplified zone lookup based on latitude (approximation for continental US)
// In a production app, you'd use a proper API or detailed zone map data
function getZoneFromCoordinates(lat: number, lng: number): string {
  // Continental US approximation based on latitude
  // This is a simplified model - real zone data varies significantly by elevation and local climate
  
  // Adjust for longitude (coastal moderation)
  const coastalModifier = (lng < -120 || lng > -75) ? 1 : 0;
  
  if (lat >= 48) return '3';
  if (lat >= 45) return '4';
  if (lat >= 42) return String(5 + coastalModifier);
  if (lat >= 39) return String(6 + coastalModifier);
  if (lat >= 36) return String(7 + coastalModifier);
  if (lat >= 33) return String(8 + coastalModifier);
  if (lat >= 30) return '9';
  if (lat >= 27) return '10';
  if (lat >= 24) return '11';
  return '12';
}

interface UseHardinessZoneReturn {
  zone: string | null;
  zoneData: HardinessZone | null;
  isLoading: boolean;
  error: string | null;
  detectZone: () => void;
  setManualZone: (zone: string) => void;
  clearZone: () => void;
}

const STORAGE_KEY = 'gardenguide-hardiness-zone';

export function useHardinessZone(): UseHardinessZoneReturn {
  const [zone, setZone] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const zoneData = zone ? ZONE_DATA.find(z => z.zone === zone) || null : null;

  useEffect(() => {
    if (zone) {
      localStorage.setItem(STORAGE_KEY, zone);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [zone]);

  const detectZone = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const detectedZone = getZoneFromCoordinates(latitude, longitude);
        setZone(detectedZone);
        setIsLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location permission denied. You can set your zone manually.'
            : 'Unable to detect your location. Please set your zone manually.'
        );
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const setManualZone = useCallback((newZone: string) => {
    setZone(newZone);
    setError(null);
  }, []);

  const clearZone = useCallback(() => {
    setZone(null);
    setError(null);
  }, []);

  return {
    zone,
    zoneData,
    isLoading,
    error,
    detectZone,
    setManualZone,
    clearZone,
  };
}

export { ZONE_DATA };
