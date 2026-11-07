# Fixed Income Auction Dashboard

A responsive fixed income trading interface built with React and TypeScript for exploring and managing auction activity.

I designed the application around a compact, data-dense workflow that makes it easy to understand the current auction landscape at a glance and then drill into individual opportunities. The interface combines aggregate auction analytics with a sortable, searchable, and paginated data grid, while a shared filtering workflow keeps the summary and underlying auction data in sync.

The frontend architecture keeps application state and component coordination at the page level, isolates data access in a service layer, encapsulates fetching behavior in a custom hook, and keeps reusable calculations and formatting outside of UI components. The interface also includes responsive layouts, time-aware auction lifecycle states, loading and error handling, and a shared visual system across Material UI and AG Grid.

More detailed notes on the implementation and technical tradeoffs, including memoization, rendering behavior, client-side versus server-side pagination, API architecture, and potential future improvements, are available in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Running the Application

### Prerequisites

- Node.js
- npm

### Development

```bash
npm install
npm run dev
```

Vite will output the local URL for the application.

### Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Data

The public version of the application uses a synthetic auction dataset so it can run independently without external infrastructure. Filtering is applied through the same service boundary used by the rest of the application, allowing the summary analytics and grid to operate against the complete filtered dataset.

The project was originally designed to consume auction data from an external API. An API-backed implementation is retained in the service layer for reference and can be restored by configuring a `VITE_API_URL` environment variable.

All auction data included in this repository is synthetic and intended solely for demonstration.

## Technology

- React
- TypeScript
- Vite
- React Router
- Material UI
- AG Grid

## Highlights

- Aggregate statistics across the complete filtered auction dataset
- Auction filtering, sorting, pagination, and quick search
- Time-aware Upcoming, Active, Concluded, and Expired lifecycle states
- Data visualization across auction side, product type, and status
- Responsive desktop and compact-screen layouts
- Virtualized, data-dense AG Grid interface
- Loading, empty, and recoverable error states
- Shared Material UI and AG Grid design system
- Modular service, hook, utility, and component architecture