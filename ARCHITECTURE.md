# Architecture

## Structure

- Keep pages responsible for composing components and coordinating application state.
- Keep UI components separate from API communication.
- Use custom hooks to manage data fetching and related loading/error state.
- Keep reusable formatting and calculation helpers in `utils/`.
- Keep the architecture lightweight for the scope of the application rather than introducing additional state-management or data-fetching libraries.

## API

- Handle API communication in `services/`.
- Keep API/domain models in `interfaces/` and shared union types in `types/`.
- Normalize API responses in the service layer before passing data to the rest of the application. The auction endpoint can return either a raw array or a paginated response object, so the service exposes a consistent response shape to the UI.
- Use native `fetch` rather than adding another HTTP dependency.
- Configure the API base URL through `VITE_API_URL`.

## Data Flow and Pagination

The dashboard maintains the currently applied auction query and passes it to `useAuctions`.

`useAuctions` retrieves the complete matching auction dataset and exposes the data along with loading, error, refresh, and last-updated state.

The same returned dataset is then used by both:

- `AuctionSummary`, which calculates totals and breakdowns across all matching auctions.
- `AuctionGrid`, which provides client-side pagination, sorting, and quick search.

The API supports server-side pagination, but the application intentionally does not use it for the current dataset.

The dashboard requirement states that summary values should represent the entire filtered dataset. The API does not provide a separate aggregate/summary endpoint, so requesting only one server-side page would leave the client without enough information to calculate total size, average price, side/product breakdowns, and lifecycle counts across all matching auctions.

Fetching the complete filtered dataset once also allows AG Grid to provide consistent pagination, sorting, and quick search across the same set of auctions used by the summary.

Given the current dataset size, this keeps the implementation simple and ensures the summary and grid remain consistent.

For a substantially larger dataset, I would change the architecture to use:

- Server-side pagination and sorting for grid data.
- A separate aggregate endpoint for summary statistics.
- Server-supported search when searching across the entire result set.

This would allow the grid to scale without requiring the browser to download the complete filtered dataset.

## Rendering and Memoization

Rendering and memoization are used selectively rather than applied to every calculation or callback.

The main goal is to keep frequently rendered data-heavy components stable while avoiding unnecessary optimization of inexpensive operations.

- `AuctionGrid` memoizes its column definitions and default column configuration. These objects are passed directly to AG Grid, so keeping their references stable avoids unnecessary grid configuration updates during normal React re-renders.
- `AuctionSummary` memoizes the derived auction statistics. Summary calculations iterate over the complete filtered dataset and are recalculated only when the auction data or current lifecycle time changes.
- The summary recalculates auction lifecycle status as the current time changes. This allows time-based transitions such as Upcoming → Active → Expired, as well as Concluded when a qualifying conclusion timestamp is already present, without refetching the dataset.
- Lightweight calculations, such as counting active filters, are intentionally not memoized because the cost of recomputing them is lower than the additional memoization complexity.
- Fixed `Intl.NumberFormat` instances are reused for frequently rendered numeric and price values rather than recreated for every grid cell formatting operation.
- Grid pagination, sorting, and quick search operate against the already loaded filtered dataset, avoiding additional network requests for normal table interactions.
- During subsequent API requests, previously loaded summary data remains rendered rather than being replaced by loading placeholders. This reduces visual churn while still allowing the grid to communicate that its data is refreshing.

The application does not use `React.memo`, `useCallback`, or `useMemo` by default. These tools are introduced only where stable references or non-trivial derived calculations provide a clear benefit.

## Loading and Error States

The UI distinguishes between the initial request and later refreshes:

- Initial loading uses summary skeletons and the grid loading state.
- An initial failure replaces the dashboard content with an error state and retry action.
- A failure after data has already loaded preserves the previous results and displays a non-destructive refresh error.
- Successful empty responses are treated as valid results rather than loading or error states.
- Older in-flight requests are prevented from overwriting results from newer queries.

## Filters

Filter controls maintain a local draft so users can edit multiple values before applying them.

When filters are applied, the draft is converted into a sparse `AuctionQuery`. Empty controls are omitted, meaning an empty query object represents the unfiltered dataset.

CUSIPs are normalized before being sent to the API by trimming whitespace, converting to uppercase, removing empty values, and removing duplicates.

On larger screens, filters are displayed in a permanent side panel. On smaller screens, the same filter component is presented in a temporary drawer.

## Auction Status

Auction lifecycle status is derived from the supplied curtain, expiration, and conclusion timestamps.

Auctions are classified as:

- Upcoming
- Active
- Concluded
- Expired

The current time is updated periodically so the summary can reflect lifecycle changes without requiring another API request.

## Navigation

React Router is used for application routing.

The current application contains a single dashboard route, so the routing configuration is intentionally minimal while leaving room for additional pages if the application expands.

## Design System

MUI provides the application layout, controls, typography, and component styling.

A centralized theme defines:

- Brand colors
- Surface and border colors
- Typography
- KPI colors
- Data visualization colors
- Shared input, button, card, and toggle styling

AG Grid uses a separate grid theme derived from the same application color system so the grid remains visually consistent with the MUI interface.

The UI is designed as a compact, information-dense workstation while keeping data categories visually distinct and avoiding unnecessary decorative elements.

## Future Enhancements

For a larger production application, I would consider:

- Server-side pagination, sorting, and dedicated summary aggregation for larger datasets.
- Server-supported global search when data is no longer loaded entirely in the client.
- Request cancellation/deduplication or a server-state caching library for more complex data-fetching needs.
    (This came to my attention upon observing a duplicate api call on page load as a result of StrictMode.)
- More visible active-filter state on compact layouts when the filter drawer is closed.
- Accessibility review, including keyboard and screen-reader behavior.
- Additional auction timing/status controls if workflow requirements expand.
- Richer fixed-income analytics if additional security data becomes available from the API.