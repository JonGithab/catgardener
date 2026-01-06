import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { PlantCard } from '@/components/PlantCard';
import { plants } from '@/data/plants';
import { Grid3X3, Droplets, BookOpen, Leaf, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Grid3X3,
    title: 'Visual Garden Planner',
    description: 'Drag and drop plants onto a grid to design your perfect garden layout.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Droplets,
    title: 'Watering Reminders',
    description: 'Never forget to water again with smart scheduling and reminders.',
    color: 'bg-garden-water/10 text-garden-water',
  },
  {
    icon: BookOpen,
    title: 'Plant Care Guide',
    description: 'Expert tips on sunlight, spacing, companion planting and more.',
    color: 'bg-accent/10 text-accent',
  },
];

export default function Index() {
  const featuredPlants = plants.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-50" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Your personal gardening companion
            </div>
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Grow Your
              <span className="block text-gradient-primary">Dream Garden</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Plan beautiful garden layouts, track watering schedules, and get personalized plant care tips. From first seed to full bloom.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/planner" className="gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  Start Planning
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/plants" className="gap-2">
                  Browse Plants
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Everything You Need to Garden
            </h2>
            <p className="text-muted-foreground">
              Simple tools designed for gardeners of all experience levels.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card shadow-card border border-border/50 transition-all duration-300 hover:shadow-garden-md hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                Popular Plants
              </h2>
              <p className="text-muted-foreground">
                Get started with these beginner-friendly favorites.
              </p>
            </div>
            <Button asChild variant="ghost" className="gap-2">
              <Link to="/plants">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPlants.map((plant, index) => (
              <div
                key={plant.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 mb-6">
            <Leaf className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Growing?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Create your first garden bed in minutes. No account required – your garden data is saved locally.
          </p>
          <Button asChild variant="secondary" size="xl">
            <Link to="/planner" className="gap-2">
              Create Your Garden
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span>Cat Gardener Guide</span>
          </div>
          <p>Helping you grow beautiful gardens 🌱</p>
        </div>
      </footer>
    </div>
  );
}
