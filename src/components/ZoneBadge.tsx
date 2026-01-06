import { cn } from '@/lib/utils';
import { Check, AlertTriangle, X } from 'lucide-react';
import { getZoneCompatibility, plantZones } from '@/data/plantZones';

interface ZoneBadgeProps {
  plantId: string;
  userZone: string | null;
  showLabel?: boolean;
  className?: string;
}

export function ZoneBadge({ plantId, userZone, showLabel = true, className }: ZoneBadgeProps) {
  if (!userZone) return null;

  const compatibility = getZoneCompatibility(plantId, userZone);
  const zoneInfo = plantZones[plantId];

  const config = {
    ideal: {
      icon: Check,
      label: 'Ideal for your zone',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    possible: {
      icon: Check,
      label: 'Grows in your zone',
      className: 'bg-primary/10 text-primary',
    },
    challenging: {
      icon: AlertTriangle,
      label: 'May struggle in your zone',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  };

  const { icon: Icon, label, className: badgeClass } = config[compatibility];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        badgeClass,
        className
      )}
      title={zoneInfo ? `Zones ${zoneInfo.minZone}-${zoneInfo.maxZone}` : undefined}
    >
      <Icon className="h-3 w-3" />
      {showLabel && <span>{label}</span>}
    </div>
  );
}
