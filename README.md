# Auction Dashboard

Hi, this is Zach. I had a lot of fun building this Auction Dashboard over the weekend.

I approached this project with the goal of keeping its architecture straightforward while putting a lot of attention into the usability and presentation of the UI. The dashboard page primarily coordinates application state and components, API communication is isolated in the service layer, data fetching lives in a custom hook, and reusable calculations and formatting are kept outside of the UI components.

The finished dashboard summarizes the complete filtered auction dataset alongside a paginated, sortable, and searchable grid, with filters that update both views.

I used AI with this project as a development tool to move quickly, iterate on the user interface, and think through implementation tradeoffs. I owned the process end to end — interpreting the requirements, writing and debugging the application, validating API behavior, testing edge cases, and making the architectural and UI decisions.

More detailed notes on the decisions behind the implementation — including memoization, rendering behavior, client-side versus server-side pagination, API handling, and potential future improvements — are available in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Running the Application

### Prerequisites

- Node.js
- npm

### Install dependencies, configure the API, and start the development server

```bash
npm install
cp .env.example .env.local
npm run dev
```

Vite will output the local URL for the application.

### Production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Technology

- React
- TypeScript
- Vite
- React Router
- Material UI
- AG Grid

## Highlights

- Summary statistics across the complete filtered dataset
- Auction filtering, sorting, pagination, and quick search
- Time-aware auction lifecycle status
- Responsive desktop and compact-screen layouts
- Loading, empty, and recoverable error states
- Shared MUI and AG Grid design system