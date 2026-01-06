import { useState, useCallback } from 'react';
import { GardenBed, PlacedPlant } from '@/types/garden';
import { getPlantById, plants } from '@/data/plants';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface GardenGridProps {
  gardenBed: GardenBed;
  onUpdateBed: (updates: Partial<GardenBed>) => void;
  cellSize?: number;
}

export function GardenGrid({ gardenBed, onUpdateBed, cellSize = 48 }: GardenGridProps) {
  const [draggedPlant, setDraggedPlant] = useState<string | null>(null);
  const [selectedPlacedPlant, setSelectedPlacedPlant] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const plantId = e.dataTransfer.getData('plantId');
    if (!plantId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    const plant = getPlantById(plantId);
    if (!plant) return;

    // Create watering schedule
    const now = new Date();
    const nextWatering = new Date(now);
    nextWatering.setDate(nextWatering.getDate() + plant.waterFrequency);

    const newPlacedPlant: PlacedPlant = {
      id: crypto.randomUUID(),
      plantId,
      position: { x, y },
      size: { width: 1, height: 1 },
      lastWatered: now.toISOString(),
      nextWatering: nextWatering.toISOString(),
    };

    onUpdateBed({
      plants: [...gardenBed.plants, newPlacedPlant],
    });
  }, [gardenBed.plants, onUpdateBed, cellSize]);

  const handleRemovePlant = useCallback((placedPlantId: string) => {
    onUpdateBed({
      plants: gardenBed.plants.filter(p => p.id !== placedPlantId),
    });
    setSelectedPlacedPlant(null);
  }, [gardenBed.plants, onUpdateBed]);

  const handleMovePlant = useCallback((e: React.DragEvent, placedPlant: PlacedPlant) => {
    e.dataTransfer.setData('movePlantId', placedPlant.id);
    setDraggedPlant(placedPlant.id);
  }, []);

  const handleDropMove = useCallback((e: React.DragEvent) => {
    const movePlantId = e.dataTransfer.getData('movePlantId');
    if (!movePlantId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    onUpdateBed({
      plants: gardenBed.plants.map(p =>
        p.id === movePlantId ? { ...p, position: { x, y } } : p
      ),
    });
    setDraggedPlant(null);
  }, [gardenBed.plants, onUpdateBed, cellSize]);

  return (
    <div className="relative">
      {/* Grid container */}
      <div
        className="relative garden-grid rounded-xl overflow-hidden bg-garden-sage/30 border-2 border-garden-soil/20"
        style={{
          width: gardenBed.width * cellSize,
          height: gardenBed.height * cellSize,
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => {
          handleDropMove(e);
          handleDrop(e);
        }}
      >
        {/* Placed plants */}
        {gardenBed.plants.map(placedPlant => {
          const plant = getPlantById(placedPlant.plantId);
          if (!plant) return null;

          return (
            <div
              key={placedPlant.id}
              draggable
              onDragStart={(e) => handleMovePlant(e, placedPlant)}
              onDragEnd={() => setDraggedPlant(null)}
              onClick={() => setSelectedPlacedPlant(
                selectedPlacedPlant === placedPlant.id ? null : placedPlant.id
              )}
              className={cn(
                'absolute flex items-center justify-center rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200',
                'hover:scale-110 hover:z-10',
                draggedPlant === placedPlant.id && 'opacity-50',
                selectedPlacedPlant === placedPlant.id && 'ring-2 ring-primary ring-offset-2'
              )}
              style={{
                left: placedPlant.position.x * cellSize + 4,
                top: placedPlant.position.y * cellSize + 4,
                width: placedPlant.size.width * cellSize - 8,
                height: placedPlant.size.height * cellSize - 8,
                backgroundColor: plant.color + '33',
                borderColor: plant.color,
                borderWidth: 2,
              }}
            >
              <span className="text-xl select-none">{plant.emoji}</span>
              {selectedPlacedPlant === placedPlant.id && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePlant(placedPlant.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {gardenBed.plants.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Drag plants here to add them</p>
          </div>
        )}
      </div>
    </div>
  );
}
