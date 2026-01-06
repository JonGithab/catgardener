// USDA Hardiness Zone compatibility for each plant
// Format: { plantId: { minZone: number, maxZone: number } }
// This indicates the range of zones where the plant can thrive

export interface PlantZoneInfo {
  minZone: number;
  maxZone: number;
}

export const plantZones: Record<string, PlantZoneInfo> = {
  tomato: { minZone: 3, maxZone: 11 },
  basil: { minZone: 4, maxZone: 11 },
  carrot: { minZone: 3, maxZone: 10 },
  lettuce: { minZone: 2, maxZone: 11 },
  pepper: { minZone: 4, maxZone: 11 },
  cucumber: { minZone: 4, maxZone: 11 },
  strawberry: { minZone: 3, maxZone: 10 },
  sunflower: { minZone: 2, maxZone: 11 },
  zucchini: { minZone: 3, maxZone: 11 },
  mint: { minZone: 3, maxZone: 11 },
  lavender: { minZone: 5, maxZone: 9 },
  radish: { minZone: 2, maxZone: 10 },
};

export function isPlantSuitableForZone(plantId: string, zone: string | number): boolean {
  const zoneNum = typeof zone === 'string' ? parseInt(zone, 10) : zone;
  const zoneInfo = plantZones[plantId];
  
  if (!zoneInfo) return true; // If no zone data, assume it's suitable
  
  return zoneNum >= zoneInfo.minZone && zoneNum <= zoneInfo.maxZone;
}

export function getZoneCompatibility(plantId: string, zone: string | number): 'ideal' | 'possible' | 'challenging' {
  const zoneNum = typeof zone === 'string' ? parseInt(zone, 10) : zone;
  const zoneInfo = plantZones[plantId];
  
  if (!zoneInfo) return 'possible';
  
  // Check if zone is in the middle 60% of the range (ideal)
  const range = zoneInfo.maxZone - zoneInfo.minZone;
  const buffer = range * 0.2;
  
  if (zoneNum >= zoneInfo.minZone + buffer && zoneNum <= zoneInfo.maxZone - buffer) {
    return 'ideal';
  }
  
  if (zoneNum >= zoneInfo.minZone && zoneNum <= zoneInfo.maxZone) {
    return 'possible';
  }
  
  return 'challenging';
}
