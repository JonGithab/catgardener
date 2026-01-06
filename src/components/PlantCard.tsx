import { ReactNode } from 'react';
import { Plant } from '@/types/garden';
import { Sun, CloudSun, Cloud, Droplets, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
  draggable?: boolean;
  zoneBadge?: ReactNode;
}

const sunIcons = {
  'full-sun': Sun,
  'partial-shade': CloudSun,
  'shade': Cloud,
};

const sunLabels = {
  'full-sun': 'Full Sun',
  'partial-shade': 'Partial Shade',
  'shade': 'Shade',
};

export function PlantCard({ plant, onClick, selected, compact, draggable, zoneBadge }: PlantCardProps) {
  const SunIcon = sunIcons[plant.sunRequirement];

  if (compact) {
    return (
      <button
        onClick={onClick}
        draggable={draggable}
        onDragStart={(e) => {
          e.dataTransfer.setData('plantId', plant.id);
        }}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 w-full text-left',
          'hover:shadow-garden-md hover:scale-[1.02] cursor-grab active:cursor-grabbing',
          selected
            ? 'border-primary bg-primary/5 shadow-garden-sm'
            : 'border-transparent bg-card hover:border-primary/30'
        )}
      >
        <span className="text-2xl">{plant.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{plant.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SunIcon className="h-3 w-3" />
            <span>{sunLabels[plant.sunRequirement]}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-200',
        'hover:shadow-garden-md hover:scale-[1.02]',
        selected
          ? 'border-primary bg-primary/5 shadow-garden-sm'
          : 'border-transparent bg-card shadow-card hover:border-primary/30'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl group-hover:animate-sway">{plant.emoji}</span>
        <div
          className="h-3 w-3 rounded-full shadow-garden-sm"
          style={{ backgroundColor: plant.color }}
        />
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
        {plant.name}
      </h3>
      
      {zoneBadge && <div className="mb-2">{zoneBadge}</div>}
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {plant.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-1">
          <SunIcon className="h-3.5 w-3.5" />
          <span>{sunLabels[plant.sunRequirement]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5" />
          <span>Every {plant.waterFrequency}d</span>
        </div>
        <div className="flex items-center gap-1">
          <Ruler className="h-3.5 w-3.5" />
          <span>{plant.spacing}"</span>
        </div>
      </div>
    </button>
  );
}
