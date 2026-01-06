import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { WateringCard } from '@/components/WateringCard';
import { useGardenStorage } from '@/hooks/useGardenStorage';
import { getPlantById } from '@/data/plants';
import { Droplets, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isToday, isTomorrow, isPast, addDays, startOfDay } from 'date-fns';

export default function Watering() {
  const { gardenBeds, markAsWatered, isLoaded, setGardenBeds } = useGardenStorage();

  const wateringItems = useMemo(() => {
    const items: Array<{
      placedPlant: typeof gardenBeds[0]['plants'][0];
      gardenBed: typeof gardenBeds[0];
      status: 'overdue' | 'today' | 'tomorrow' | 'upcoming';
    }> = [];

    gardenBeds.forEach(bed => {
      bed.plants.forEach(plant => {
        if (!plant.nextWatering) return;
        
        const nextDate = new Date(plant.nextWatering);
        let status: 'overdue' | 'today' | 'tomorrow' | 'upcoming';
        
        if (isPast(nextDate) && !isToday(nextDate)) {
          status = 'overdue';
        } else if (isToday(nextDate)) {
          status = 'today';
        } else if (isTomorrow(nextDate)) {
          status = 'tomorrow';
        } else {
          status = 'upcoming';
        }

        items.push({ placedPlant: plant, gardenBed: bed, status });
      });
    });

    // Sort: overdue first, then today, tomorrow, upcoming
    const statusOrder = { overdue: 0, today: 1, tomorrow: 2, upcoming: 3 };
    return items.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [gardenBeds]);

  const handleWater = (placedPlantId: string, gardenBedId: string) => {
    const bed = gardenBeds.find(b => b.id === gardenBedId);
    const placedPlant = bed?.plants.find(p => p.id === placedPlantId);
    if (!placedPlant) return;

    const plant = getPlantById(placedPlant.plantId);
    if (!plant) return;

    const now = new Date();
    const nextWatering = addDays(startOfDay(now), plant.waterFrequency);

    // Update the garden bed
    setGardenBeds(prev =>
      prev.map(b =>
        b.id === gardenBedId
          ? {
              ...b,
              plants: b.plants.map(p =>
                p.id === placedPlantId
                  ? { ...p, lastWatered: now.toISOString(), nextWatering: nextWatering.toISOString() }
                  : p
              ),
            }
          : b
      )
    );

    toast.success(`${plant.name} watered! Next watering in ${plant.waterFrequency} days.`);
  };

  const overdueCount = wateringItems.filter(i => i.status === 'overdue').length;
  const todayCount = wateringItems.filter(i => i.status === 'today').length;
  const upcomingCount = wateringItems.filter(i => i.status === 'tomorrow' || i.status === 'upcoming').length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading watering schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Watering Schedule
          </h1>
          <p className="text-muted-foreground">
            Keep your plants happy with regular watering reminders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Overdue</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{overdueCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-garden-water/10 border border-garden-water/20">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-garden-water" />
              <span className="text-sm font-medium text-garden-water">Due Today</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{todayCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{upcomingCount}</p>
          </div>
        </div>

        {/* Watering List */}
        {wateringItems.length > 0 ? (
          <div className="space-y-3">
            {wateringItems.map(({ placedPlant, gardenBed }) => (
              <WateringCard
                key={placedPlant.id}
                placedPlant={placedPlant}
                gardenBed={gardenBed}
                onWater={() => handleWater(placedPlant.id, gardenBed.id)}
              />
            ))}
          </div>
        ) : gardenBeds.length > 0 ? (
          <div className="p-12 rounded-2xl bg-muted/30 border-2 border-dashed border-border text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-display text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              Your plants have been watered. Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-muted/30 border-2 border-dashed border-border text-center">
            <Droplets className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-xl font-semibold mb-2">No Plants Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add plants to your garden to start tracking watering schedules.
            </p>
            <Button asChild variant="hero">
              <Link to="/planner">Go to Garden Planner</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
