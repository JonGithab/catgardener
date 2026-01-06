import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CreateGardenDialogProps {
  onCreateGarden: (name: string, width: number, height: number) => void;
}

export function CreateGardenDialog({ onCreateGarden }: CreateGardenDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateGarden(name.trim(), width, height);
      setName('');
      setWidth(8);
      setHeight(6);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create Garden Bed
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">New Garden Bed</DialogTitle>
            <DialogDescription>
              Create a new garden bed to start planning your plants.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Garden Name</Label>
              <Input
                id="name"
                placeholder="e.g., Vegetable Patch, Herb Garden..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="width">Width (squares)</Label>
                <Input
                  id="width"
                  type="number"
                  min={4}
                  max={16}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Height (squares)</Label>
                <Input
                  id="height"
                  type="number"
                  min={4}
                  max={12}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Each square represents approximately 1 square foot.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="garden" disabled={!name.trim()}>
              Create Garden
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
