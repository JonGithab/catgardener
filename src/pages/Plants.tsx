import { useState } from 'react';
import { Header } from '@/components/Header';
import { PlantCard } from '@/components/PlantCard';
import { plants } from '@/data/plants';
import { Plant } from '@/types/garden';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Sun, CloudSun, Cloud, Droplets, Ruler, Users, AlertTriangle, Lightbulb, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHardinessZone } from '@/hooks/useHardinessZone';
import { ZoneSelector } from '@/components/ZoneSelector';
import { ZoneBadge } from '@/components/ZoneBadge';
import { isPlantSuitableForZone, plantZones } from '@/data/plantZones';

const sunIcons = {
  'full-sun': Sun,
  'partial-shade': CloudSun,
  'shade': Cloud,
};

const sunLabels = {
  'full-sun': 'Full Sun (6+ hours)',
  'partial-shade': 'Partial Shade (3-6 hours)',
  'shade': 'Shade (< 3 hours)',
};

type SunFilter = 'all' | 'full-sun' | 'partial-shade' | 'shade';
type ZoneFilter = 'all' | 'suitable';

export default function Plants() {
  const [search, setSearch] = useState('');
  const [sunFilter, setSunFilter] = useState<SunFilter>('all');
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  const { zone, isLoading, error, detectZone, setManualZone, clearZone } = useHardinessZone();

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(search.toLowerCase()) ||
      plant.description.toLowerCase().includes(search.toLowerCase());
    const matchesSun = sunFilter === 'all' || plant.sunRequirement === sunFilter;
    const matchesZone = zoneFilter === 'all' || !zone || isPlantSuitableForZone(plant.id, zone);
    return matchesSearch && matchesSun && matchesZone;
  });
  
  // Sort plants: suitable for zone first, then alphabetically
  const sortedPlants = zone
    ? [...filteredPlants].sort((a, b) => {
        const aScore = isPlantSuitableForZone(a.id, zone) ? 0 : 1;
        const bScore = isPlantSuitableForZone(b.id, zone) ? 0 : 1;
        if (aScore !== bScore) return aScore - bScore;
        return a.name.localeCompare(b.name);
      })
    : filteredPlants;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Plant Guide
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of plants with detailed care instructions.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="mb-6">
          <ZoneSelector
            zone={zone}
            isLoading={isLoading}
            error={error}
            onDetect={detectZone}
            onManualSelect={setManualZone}
            onClear={clearZone}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'full-sun', 'partial-shade', 'shade'] as SunFilter[]).map(filter => {
              const Icon = filter === 'all' ? Sun : sunIcons[filter as keyof typeof sunIcons];
              return (
                <Button
                  key={filter}
                  variant={sunFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSunFilter(filter)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                  </span>
                </Button>
              );
            })}
            {zone && (
              <Button
                variant={zoneFilter === 'suitable' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setZoneFilter(zoneFilter === 'all' ? 'suitable' : 'all')}
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Zone {zone} Only</span>
              </Button>
            )}
          </div>
        </div>

        {/* Plant Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedPlants.map((plant, index) => (
            <div
              key={plant.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <PlantCard
                plant={plant}
                onClick={() => setSelectedPlant(plant)}
                zoneBadge={zone ? <ZoneBadge plantId={plant.id} userZone={zone} /> : undefined}
              />
            </div>
          ))}
        </div>

        {sortedPlants.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No plants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Plant Detail Dialog */}
      <Dialog open={!!selectedPlant} onOpenChange={() => setSelectedPlant(null)}>
        {selectedPlant && (
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-4xl">{selectedPlant.emoji}</span>
                <span className="font-display text-2xl">{selectedPlant.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <p className="text-muted-foreground">{selectedPlant.description}</p>
                {zone && (
                  <div className="flex items-center gap-2">
                    <ZoneBadge plantId={selectedPlant.id} userZone={zone} />
                    {plantZones[selectedPlant.id] && (
                      <span className="text-xs text-muted-foreground">
                        (Zones {plantZones[selectedPlant.id].minZone}-{plantZones[selectedPlant.id].maxZone})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted text-center">
                  {(() => {
                    const Icon = sunIcons[selectedPlant.sunRequirement];
                    return <Icon className="h-5 w-5 mx-auto mb-1 text-garden-sun" />;
                  })()}
                  <p className="text-xs text-muted-foreground">
                    {sunLabels[selectedPlant.sunRequirement].split(' (')[0]}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted text-center">
                  <Droplets className="h-5 w-5 mx-auto mb-1 text-garden-water" />
                  <p className="text-xs text-muted-foreground">
                    Every {selectedPlant.waterFrequency} days
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    {plantZones[selectedPlant.id] 
                      ? `Zones ${plantZones[selectedPlant.id].minZone}-${plantZones[selectedPlant.id].maxZone}`
                      : 'All zones'
                    }
                  </p>
                </div>
              </div>

              {/* Companion Plants */}
              {selectedPlant.companions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Good Companions</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlant.companions.map(companion => (
                      <span
                        key={companion}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize"
                      >
                        {companion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Plants to Avoid */}
              {selectedPlant.avoid.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <h4 className="font-medium text-foreground">Avoid Planting With</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlant.avoid.map(avoid => (
                      <span
                        key={avoid}
                        className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm capitalize"
                      >
                        {avoid}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-foreground">Growing Tips</h4>
                </div>
                <ul className="space-y-2">
                  {selectedPlant.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
