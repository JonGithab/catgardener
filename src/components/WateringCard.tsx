import { PlacedPlant, GardenBed } from '@/types/garden';
import { getPlantById } from '@/data/plants';
import { Button } from './ui/button';
import { Droplets, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format, isToday, isTomorrow, isPast } from 'date-fns';

interface WateringCardProps {
  placedPlant: PlacedPlant;
  gardenBed: GardenBed;
  onWater: () => void;
}

export function WateringCard({ placedPlant, gardenBed, onWater }: WateringCardProps) {
  const plant = getPlantById(placedPlant.plantId);
  if (!plant) return null;

  const nextWatering = placedPlant.nextWatering ? new Date(placedPlant.nextWatering) : null;
  const lastWatered = placedPlant.lastWatered ? new Date(placedPlant.lastWatered) : null;

  const isOverdue = nextWatering && isPast(nextWatering);
  const isDueToday = nextWatering && isToday(nextWatering);
  const isDueTomorrow = nextWatering && isTomorrow(nextWatering);

  const getStatusColor = () => {
    if (isOverdue) return 'border-destructive/50 bg-destructive/5';
    if (isDueToday) return 'border-garden-water/50 bg-garden-water/5';
    return 'border-border bg-card';
  };

  const getStatusBadge = () => {
    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-destructive">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </span>
      );
    }
    if (isDueToday) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-garden-water">
          <Droplets className="h-3 w-3" />
          Today
        </span>
      );
    }
    if (isDueTomorrow) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3 w-3" />
          Tomorrow
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
        getStatusColor()
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
        {plant.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground truncate">{plant.name}</h4>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          in {gardenBed.name}
        </p>
        {lastWatered && (
          <p className="text-xs text-muted-foreground mt-1">
            Last watered {formatDistanceToNow(lastWatered, { addSuffix: true })}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {nextWatering && (
          <p className="text-xs text-muted-foreground">
            {isOverdue
              ? `Was due ${format(nextWatering, 'MMM d')}`
              : isDueToday
              ? 'Due today'
              : `Due ${format(nextWatering, 'MMM d')}`}
          </p>
        )}
        <Button
          variant="water"
          size="sm"
          onClick={onWater}
          className="gap-1"
        >
          <Droplets className="h-4 w-4" />
          Watered
        </Button>
      </div>
    </div>
  );
}
