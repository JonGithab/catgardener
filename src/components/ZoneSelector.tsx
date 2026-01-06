import { MapPin, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZONE_DATA } from '@/hooks/useHardinessZone';
import { cn } from '@/lib/utils';

interface ZoneSelectorProps {
  zone: string | null;
  isLoading: boolean;
  error: string | null;
  onDetect: () => void;
  onManualSelect: (zone: string) => void;
  onClear: () => void;
  compact?: boolean;
}

export function ZoneSelector({
  zone,
  isLoading,
  error,
  onDetect,
  onManualSelect,
  onClear,
  compact = false,
}: ZoneSelectorProps) {
  const zoneData = zone ? ZONE_DATA.find(z => z.zone === zone) : null;

  if (compact && zone) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        <MapPin className="h-3.5 w-3.5" />
        Zone {zone}
        <button
          onClick={onClear}
          className="ml-1 hover:text-primary/70 transition-colors"
          aria-label="Clear zone"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("p-4 rounded-xl border border-border bg-card", compact && "p-3")}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-1">USDA Hardiness Zone</h3>
          
          {zone ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  <Check className="h-3.5 w-3.5" />
                  Zone {zone}
                </span>
                <button
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change
                </button>
              </div>
              {zoneData && (
                <p className="text-sm text-muted-foreground">{zoneData.description}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {error || 'Set your zone for personalized plant recommendations.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDetect}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {isLoading ? 'Detecting...' : 'Detect My Zone'}
                </Button>
                <Select onValueChange={onManualSelect}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONE_DATA.map((z) => (
                      <SelectItem key={z.zone} value={z.zone}>
                        Zone {z.zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
