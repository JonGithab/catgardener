import { useState, useEffect, useCallback } from 'react';
import { GardenBed, WateringSchedule } from '@/types/garden';

const GARDEN_BEDS_KEY = 'gardenguide-beds';
const WATERING_KEY = 'gardenguide-watering';

export function useGardenStorage() {
  const [gardenBeds, setGardenBeds] = useState<GardenBed[]>([]);
  const [wateringSchedules, setWateringSchedules] = useState<WateringSchedule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedBeds = localStorage.getItem(GARDEN_BEDS_KEY);
      const savedWatering = localStorage.getItem(WATERING_KEY);
      
      if (savedBeds) {
        setGardenBeds(JSON.parse(savedBeds));
      }
      if (savedWatering) {
        setWateringSchedules(JSON.parse(savedWatering));
      }
    } catch (error) {
      console.error('Error loading garden data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save garden beds
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(GARDEN_BEDS_KEY, JSON.stringify(gardenBeds));
    }
  }, [gardenBeds, isLoaded]);

  // Save watering schedules
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WATERING_KEY, JSON.stringify(wateringSchedules));
    }
  }, [wateringSchedules, isLoaded]);

  const addGardenBed = useCallback((bed: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBed: GardenBed = {
      ...bed,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGardenBeds(prev => [...prev, newBed]);
    return newBed;
  }, []);

  const updateGardenBed = useCallback((id: string, updates: Partial<GardenBed>) => {
    setGardenBeds(prev =>
      prev.map(bed =>
        bed.id === id
          ? { ...bed, ...updates, updatedAt: new Date().toISOString() }
          : bed
      )
    );
  }, []);

  const deleteGardenBed = useCallback((id: string) => {
    setGardenBeds(prev => prev.filter(bed => bed.id !== id));
    setWateringSchedules(prev => prev.filter(s => s.gardenBedId !== id));
  }, []);

  const markAsWatered = useCallback((placedPlantId: string, frequencyDays: number) => {
    const now = new Date();
    const nextWatering = new Date(now);
    nextWatering.setDate(nextWatering.getDate() + frequencyDays);

    setWateringSchedules(prev => {
      const existing = prev.find(s => s.placedPlantId === placedPlantId);
      if (existing) {
        return prev.map(s =>
          s.placedPlantId === placedPlantId
            ? { ...s, lastWatered: now.toISOString(), nextWatering: nextWatering.toISOString() }
            : s
        );
      }
      return prev;
    });

    // Also update in garden bed
    setGardenBeds(prev =>
      prev.map(bed => ({
        ...bed,
        plants: bed.plants.map(plant =>
          plant.id === placedPlantId
            ? { ...plant, lastWatered: now.toISOString(), nextWatering: nextWatering.toISOString() }
            : plant
        ),
      }))
    );
  }, []);

  const getPlantsNeedingWater = useCallback(() => {
    const now = new Date();
    const needsWater: Array<{
      bed: GardenBed;
      plant: typeof gardenBeds[0]['plants'][0];
      isOverdue: boolean;
    }> = [];

    gardenBeds.forEach(bed => {
      bed.plants.forEach(plant => {
        if (plant.nextWatering) {
          const nextDate = new Date(plant.nextWatering);
          if (nextDate <= now) {
            needsWater.push({ bed, plant, isOverdue: true });
          } else {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (nextDate <= tomorrow) {
              needsWater.push({ bed, plant, isOverdue: false });
            }
          }
        }
      });
    });

    return needsWater;
  }, [gardenBeds]);

  return {
    gardenBeds,
    wateringSchedules,
    isLoaded,
    addGardenBed,
    updateGardenBed,
    deleteGardenBed,
    markAsWatered,
    getPlantsNeedingWater,
    setGardenBeds,
  };
}
