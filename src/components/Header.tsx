import { Link, useLocation } from 'react-router-dom';
import { Leaf, Grid3X3, Droplets, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Leaf },
  { path: '/planner', label: 'Garden Planner', icon: Grid3X3 },
  { path: '/watering', label: 'Watering', icon: Droplets },
  { path: '/plants', label: 'Plant Guide', icon: BookOpen },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-garden-sm transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            GardenGuide
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                location.pathname === path
                  ? 'bg-primary text-primary-foreground shadow-garden-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-1">
          {navItems.map(({ path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center justify-center h-10 w-10 rounded-lg transition-colors',
                location.pathname === path
                  ? 'bg-primary text-primary-foreground shadow-garden-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
