import { useState } from 'react';
import { Header } from '@/components/Header';
import { GardenGrid } from '@/components/GardenGrid';
import { PlantCard } from '@/components/PlantCard';
import { CreateGardenDialog } from '@/components/CreateGardenDialog';
import { Button } from '@/components/ui/button';
import { plants } from '@/data/plants';
import { useGardenStorage } from '@/hooks/useGardenStorage';
import { GardenBed } from '@/types/garden';
import { Trash2, ChevronLeft, ChevronRight, Grid3X3, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Planner() {
  const { gardenBeds, addGardenBed, updateGardenBed, deleteGardenBed, isLoaded } = useGardenStorage();
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [plantSearch, setPlantSearch] = useState('');
  const [showPlantPanel, setShowPlantPanel] = useState(true);

  const selectedBed = gardenBeds.find(b => b.id === selectedBedId);

  const handleCreateGarden = (name: string, width: number, height: number) => {
    const newBed = addGardenBed({ name, width, height, plants: [] });
    setSelectedBedId(newBed.id);
    toast.success(`Created "${name}" garden bed!`);
  };

  const handleUpdateBed = (updates: Partial<GardenBed>) => {
    if (selectedBedId) {
      updateGardenBed(selectedBedId, updates);
    }
  };

  const handleDeleteBed = (bedId: string) => {
    const bed = gardenBeds.find(b => b.id === bedId);
    deleteGardenBed(bedId);
    if (selectedBedId === bedId) {
      setSelectedBedId(null);
    }
    toast.success(`Deleted "${bed?.name}" garden bed`);
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(plantSearch.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading your gardens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Garden Planner
                </h1>
                <p className="text-muted-foreground">
                  Design your garden by dragging plants onto the grid.
                </p>
              </div>
              <CreateGardenDialog onCreateGarden={handleCreateGarden} />
            </div>

            {/* Garden Beds List */}
            {gardenBeds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {gardenBeds.map(bed => (
                  <Button
                    key={bed.id}
                    variant={selectedBedId === bed.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedBedId(bed.id)}
                    className="gap-2"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    {bed.name}
                    <span className="text-xs opacity-70">
                      ({bed.plants.length} plants)
                    </span>
                  </Button>
                ))}
              </div>
            )}

            {/* Selected Garden Grid */}
            {selectedBed ? (
              <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {selectedBed.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedBed.width} × {selectedBed.height} grid • {selectedBed.plants.length} plants
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBed(selectedBed.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="overflow-x-auto pb-4">
                  <GardenGrid
                    gardenBed={selectedBed}
                    onUpdateBed={handleUpdateBed}
                  />
                </div>
              </div>
            ) : gardenBeds.length > 0 ? (
              <div className="p-12 rounded-2xl bg-muted/30 border-2 border-dashed border-border text-center">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a garden bed above to start editing
                </p>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-muted/30 border-2 border-dashed border-border text-center">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-xl font-semibold mb-2">No Gardens Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first garden bed to start planning!
                </p>
                <CreateGardenDialog onCreateGarden={handleCreateGarden} />
              </div>
            )}
          </div>

          {/* Plant Sidebar */}
          <div className={cn(
            'w-full lg:w-80 transition-all duration-300',
            !showPlantPanel && 'lg:w-12'
          )}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                {showPlantPanel && (
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Available Plants
                  </h2>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPlantPanel(!showPlantPanel)}
                  className="lg:flex hidden"
                >
                  {showPlantPanel ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>

              {showPlantPanel && (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search plants..."
                      value={plantSearch}
                      onChange={(e) => setPlantSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                    {filteredPlants.map(plant => (
                      <PlantCard
                        key={plant.id}
                        plant={plant}
                        compact
                        draggable
                      />
                    ))}
                    {filteredPlants.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No plants found
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
