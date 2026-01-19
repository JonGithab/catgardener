# 🌱 Cat Gardener Guide

A comprehensive gardening assistant application for planning garden layouts, tracking watering schedules, and providing plant care tips with USDA hardiness zone awareness.

**Live Demo**: [https://catgardener.lovable.app](https://catgardener.lovable.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Components](#-components)
- [Hooks](#-hooks)
- [Data Models](#-data-models)
- [Pages](#-pages)
- [Styling](#-styling)
- [Contributing](#-contributing)

---

## ✨ Features

### 🗺️ Garden Planner
- **Visual Grid-Based Layout**: Create and manage garden beds with an intuitive drag-and-drop interface
- **Plant Placement**: Position plants on a grid system with size and spacing considerations
- **Multiple Garden Beds**: Support for creating and managing multiple garden areas

### 💧 Watering Management
- **Smart Watering Schedules**: Automated tracking of watering needs based on plant requirements
- **Overdue Alerts**: Visual indicators for plants that need immediate attention
- **Watering History**: Track when each plant was last watered

### 🌿 Plant Library
- **Comprehensive Plant Database**: Curated collection of common garden plants
- **Detailed Plant Information**: Sun requirements, watering frequency, spacing, companions, and care tips
- **Search & Filter**: Find plants by name or characteristics

### 🌡️ USDA Hardiness Zone Detection
- **Automatic Detection**: Uses geolocation to determine the user's hardiness zone
- **Manual Selection**: Option to manually set your zone
- **Zone-Aware Recommendations**: Plants are filtered and labeled based on zone compatibility
- **Visual Zone Badges**: Color-coded indicators showing plant suitability for your zone

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and functional components |
| **TypeScript** | Type-safe JavaScript for better DX and reliability |
| **Vite** | Fast build tool and development server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable component library |
| **React Router DOM** | Client-side routing |
| **TanStack Query** | Server state management |
| **date-fns** | Date manipulation utilities |
| **Lucide React** | Icon library |
| **Recharts** | Charting library for data visualization |

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── CreateGardenDialog.tsx
│   ├── GardenGrid.tsx
│   ├── Header.tsx
│   ├── NavLink.tsx
│   ├── PlantCard.tsx
│   ├── WateringCard.tsx
│   ├── ZoneBadge.tsx
│   └── ZoneSelector.tsx
├── data/                # Static data and constants
│   ├── plants.ts        # Plant database
│   └── plantZones.ts    # Plant zone compatibility data
├── hooks/               # Custom React hooks
│   ├── useGardenStorage.ts
│   ├── useHardinessZone.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                 # Utility functions
│   └── utils.ts
├── pages/               # Route page components
│   ├── Index.tsx        # Home page
│   ├── Planner.tsx      # Garden planner
│   ├── Plants.tsx       # Plant library
│   ├── Watering.tsx     # Watering schedule
│   └── NotFound.tsx     # 404 page
├── types/               # TypeScript type definitions
│   └── garden.ts
├── App.tsx              # Root component with routing
├── App.css              # Global styles
├── index.css            # Tailwind directives & CSS variables
└── main.tsx             # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

---

## 🏗️ Architecture

### State Management

The application uses a **client-side localStorage strategy** for data persistence:

```
┌─────────────────────────────────────────────────────┐
│                    React App                        │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │  Components │  │   Hooks     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│           │              │               │          │
│           └──────────────┼───────────────┘          │
│                          ▼                          │
│              ┌─────────────────────┐               │
│              │  useGardenStorage   │               │
│              │  useHardinessZone   │               │
│              └─────────────────────┘               │
│                          │                          │
│                          ▼                          │
│              ┌─────────────────────┐               │
│              │    localStorage     │               │
│              └─────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

### Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Home page with feature overview |
| `/planner` | `Planner.tsx` | Interactive garden bed designer |
| `/plants` | `Plants.tsx` | Searchable plant library |
| `/watering` | `Watering.tsx` | Watering schedule management |
| `*` | `NotFound.tsx` | 404 error page |

---

## 🧩 Components

### Core Components

#### `Header`
Navigation header with logo, navigation links, and mobile-responsive menu.

#### `PlantCard`
Displays plant information in card format with support for:
- Compact and full view modes
- Selection state
- Drag-and-drop functionality
- Zone compatibility badges

```tsx
interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
  isSelected?: boolean;
  compact?: boolean;
  draggable?: boolean;
  zoneBadge?: ReactNode;
}
```

#### `WateringCard`
Shows watering status for placed plants with:
- Overdue/due status indicators
- Last watered timestamp
- Quick water action button

#### `ZoneSelector`
Allows users to detect or manually select their USDA hardiness zone.

#### `ZoneBadge`
Color-coded badge indicating plant zone compatibility:
- 🟢 Green: Ideal for your zone
- 🟡 Yellow: May need protection
- 🔴 Red: Not recommended

#### `GardenGrid`
Interactive grid for placing and arranging plants in garden beds.

#### `CreateGardenDialog`
Modal dialog for creating new garden beds with name and dimensions.

---

## 🪝 Hooks

### `useGardenStorage`

Manages garden beds and watering schedules with localStorage persistence.

```tsx
const {
  gardenBeds,           // Array of garden beds
  wateringSchedules,    // Array of watering schedules
  isLoaded,            // Loading state
  addGardenBed,        // Create new garden bed
  updateGardenBed,     // Update existing bed
  deleteGardenBed,     // Remove garden bed
  markAsWatered,       // Record watering event
  getPlantsNeedingWater // Get plants due for watering
} = useGardenStorage();
```

### `useHardinessZone`

Handles USDA hardiness zone detection and management.

```tsx
const {
  zone,          // Current zone number (1-13) or null
  zoneData,      // Full zone data object
  isLoading,     // Detection in progress
  error,         // Error message if detection failed
  detectZone,    // Trigger geolocation-based detection
  setManualZone, // Manually set zone
  clearZone      // Reset zone selection
} = useHardinessZone();
```

---

## 📊 Data Models

### Plant

```typescript
interface Plant {
  id: string;
  name: string;
  emoji: string;
  sunRequirement: 'full-sun' | 'partial-shade' | 'shade';
  waterFrequency: number;  // Days between watering
  spacing: number;         // Inches
  companions: string[];    // Compatible plant names
  avoid: string[];         // Incompatible plant names
  description: string;
  tips: string[];
  color: string;           // Theme color
}
```

### GardenBed

```typescript
interface GardenBed {
  id: string;
  name: string;
  width: number;   // Grid units
  height: number;  // Grid units
  plants: PlacedPlant[];
  createdAt: string;
  updatedAt: string;
}
```

### PlacedPlant

```typescript
interface PlacedPlant {
  id: string;
  plantId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  lastWatered?: string;
  nextWatering?: string;
}
```

### HardinessZone

```typescript
interface HardinessZone {
  zone: number;
  minTemp: number;  // Fahrenheit
  maxTemp: number;  // Fahrenheit
  description: string;
}
```

---

## 📄 Pages

### Home (`/`)
Landing page featuring:
- Hero section with app introduction
- Feature highlights (Planner, Watering, Plant Library)
- Call-to-action buttons

### Garden Planner (`/planner`)
Interactive garden bed designer with:
- Garden bed creation/deletion
- Plant selection sidebar
- Drag-and-drop plant placement
- Grid-based layout system

### Plant Library (`/plants`)
Comprehensive plant database with:
- Search functionality
- Zone-based filtering
- Detailed plant modals
- Companion planting information

### Watering Schedule (`/watering`)
Watering management dashboard with:
- Plants needing water today
- Overdue plant alerts
- Quick water actions
- Watering history

---

## 🎨 Styling

### Design System

The project uses a semantic color token system defined in `index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 142 76% 36%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  /* ... */
}
```

### Tailwind Configuration

Custom theme extensions in `tailwind.config.ts`:
- Color palette using CSS variables
- Border radius tokens
- Animation utilities

### Component Styling

All components use:
- Tailwind utility classes
- Semantic color tokens (never raw colors)
- Responsive design patterns
- Dark mode support via CSS variables

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- [USDA Plant Hardiness Zone Map](https://planthardiness.ars.usda.gov/) for zone data reference

---

<p align="center">Made with 💚 using <a href="https://lovable.dev">Lovable</a></p>
