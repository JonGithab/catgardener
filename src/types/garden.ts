export interface Plant {
  id: string;
  name: string;
  emoji: string;
  sunRequirement: 'full-sun' | 'partial-shade' | 'shade';
  waterFrequency: number; // days between watering
  spacing: number; // inches
  companions: string[];
  avoid: string[];
  description: string;
  tips: string[];
  color: string;
}

export interface PlacedPlant {
  id: string;
  plantId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  lastWatered?: string;
  nextWatering?: string;
}

export interface GardenBed {
  id: string;
  name: string;
  width: number; // grid units
  height: number; // grid units
  plants: PlacedPlant[];
  createdAt: string;
  updatedAt: string;
}

export interface WateringSchedule {
  plantId: string;
  placedPlantId: string;
  gardenBedId: string;
  lastWatered: string;
  nextWatering: string;
  frequencyDays: number;
}
