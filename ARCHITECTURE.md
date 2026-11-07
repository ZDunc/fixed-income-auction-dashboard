# Architecture

## Structure

The application is intentionally structured around a small set of clear responsibilities:

- Pages compose components and coordinate application state.
- UI components remain separate from data-access concerns.
- Custom hooks manage data retrieval and related loading, error, refresh, and last-updated state.
- Reusable formatting, filtering, and calculation logic lives in `utils/`.
- API and data-source concerns are isolated in `services/`.
- Domain models live in `interfaces/`, with shared union types in `types/`.

The architecture is kept lightweight for the scope of the application rather than introducing additional state-management or server-state libraries without a clear need.

## Data Layer

The public portfolio version uses a synthetic local auction dataset so the application can run independently without external infrastructure.

`auctionService` remains the boundary between the UI and the underlying data source. The active implementation passes the current `AuctionQuery` through local filtering logic and returns the resulting dataset using the same response shape expected by the rest of the application.

This preserves the separation between data access and UI behavior while allowing the application to remain fully functional as a standalone project.

The application was originally designed to consume auction data from a remote API. An API-backed implementation is retained in the service layer for reference. That implementation demonstrates:

- Environment-based API configuration through `VITE_API_URL`.
- POST-based query submission.
- Native `fetch` usage without an additional HTTP dependency.
- HTTP error handling.
- Defensive normalization of either a raw auction array or a response object into a consistent application response shape.

Because the public version no longer depends on an external service, no API configuration is required to run the application.

## Data Flow and Pagination

`DashboardPage` owns the currently applied `AuctionQuery` and passes it to `useAuctions`.

`useAuctions` retrieves the complete matching auction dataset through the service layer and exposes:

- Auction data
- Loading state
- Error state
- Refresh behavior
- Last-updated state

The same returned dataset is then used by both:

- `AuctionSummary`, which calculates totals and categorical breakdowns across all matching auctions.
- `AuctionGrid`, which provides client-side pagination, sorting, and quick search.

This shared dataset is an intentional architectural decision. Summary statistics represent the complete filtered result set rather than only the currently visible grid page, keeping the analytics and underlying auction data consistent.

The original remote API supported server-side pagination. I intentionally chose not to use it because the application also needed summary statistics across the entire filtered dataset, while the API did not expose a separate aggregation endpoint. Fetching only a single page would therefore have left the client without enough information to calculate total size, average price, side and product breakdowns, and lifecycle counts correctly.

For the current dataset size, operating on the complete filtered dataset also allows AG Grid to provide pagination, sorting, and quick search without additional data requests.

For a substantially larger production dataset, I would instead use:

- Server-side pagination and sorting for grid data.
- A dedicated aggregate endpoint for summary statistics.
- Server-supported global search.
- A live data transport for real-time auction updates.

This would allow the interface to scale without requiring the browser to hold the complete filtered result set.

## Rendering and Memoization

Rendering and memoization are used selectively rather than applied to every calculation or callback.

The goal is to optimize work where it provides a clear benefit while avoiding unnecessary memoization of inexpensive operations.

- `AuctionGrid` memoizes its column definitions and default column configuration. These objects are passed directly to AG Grid, so preserving their references avoids unnecessary grid configuration updates during normal React re-renders.
- `AuctionSummary` memoizes derived auction statistics. The calculations iterate over the complete filtered dataset and are recalculated only when the auction data or current lifecycle time changes.
- Auction lifecycle statistics intentionally recalculate as time changes so auctions can transition between Upcoming, Active, Expired, and Concluded states without requiring the underlying dataset to be retrieved again.
- Lightweight calculations, such as counting active filters, are intentionally not memoized because recomputing them is less expensive than introducing unnecessary memoization.
- Fixed `Intl.NumberFormat` instances are reused for frequently rendered price and numeric values rather than recreated for individual formatting operations.
- Grid pagination, sorting, and quick search operate against the already loaded filtered dataset.
- When refreshed data is being retrieved, previously loaded summary data can remain visible rather than being immediately replaced by loading placeholders, reducing visual churn.

The application does not use `React.memo`, `useCallback`, or `useMemo` by default. These tools are introduced only when expensive derived work or reference stability provides a clear benefit.

## Loading and Error States

The data-fetching architecture distinguishes between the initial load and later refreshes:

- Initial loading uses summary skeletons and the grid loading state.
- An initial failure replaces the dashboard content with an error state and retry action.
- A failure after data has already loaded preserves the previous results and displays a non-destructive refresh error.
- Successful empty responses are treated as valid results rather than loading or error states.
- Older in-flight asynchronous operations are prevented from overwriting results from newer queries.

The current local dataset does not depend on network availability, but these states are retained because the data layer was designed to support an asynchronous remote source without requiring the UI architecture to change.

## Filters

Filter controls maintain a local draft so users can edit multiple values before applying them.

When filters are applied, the draft is converted into a sparse `AuctionQuery`. Empty controls are omitted, meaning an empty query object represents the complete dataset.

CUSIP values are normalized by:

- Trimming whitespace.
- Converting values to uppercase.
- Removing empty entries.
- Removing duplicates.

The query is then passed through the service layer, where the portfolio implementation applies the filters to the synthetic dataset.

Filtering uses AND logic across different filter categories and OR logic within multi-select categories. For example, selecting both Bid and Offer while filtering to Corporate auctions accepts either side but still requires the auction to be Corporate.

On larger screens, filters are displayed in a permanent side panel. On smaller screens, the same filter component is presented in a temporary drawer.

## Auction Status

Auction lifecycle status is derived from curtain, expiration, and conclusion timestamps.

Auctions are classified as:

- Upcoming
- Active
- Concluded
- Expired

The current time is updated periodically so lifecycle statistics can change while the application remains open.

This allows time-driven transitions such as Upcoming → Active → Expired, as well as Concluded when a qualifying conclusion timestamp is already present, without requiring the dataset to be retrieved again.

## Grid and Virtualization

AG Grid provides the primary data-table experience.

The grid supports:

- Client-side pagination.
- Column sorting.
- Quick search across displayed auction values.
- Custom formatting for prices and timestamps.
- Nullable-value handling.
- Initial auction-time sorting.
- Responsive horizontal overflow where necessary.

AG Grid also virtualizes rendered rows and columns. This keeps the number of DOM elements tied primarily to the visible viewport rather than the total dataset size, which helps maintain responsive rendering as the amount of available data grows.

## Navigation

React Router is used for application routing.

The current application contains a single dashboard route, so routing is intentionally minimal while leaving a conventional structure in place for future pages.

## Design System

Material UI provides the application layout, controls, typography, and component styling.

A centralized theme defines:

- Brand colors
- Surface and border colors
- Typography
- KPI colors
- Data visualization colors
- Shared input, button, card, and toggle styling

AG Grid uses a separate grid theme derived from the same application color system so the grid remains visually consistent with the surrounding Material UI components.

The interface is designed as a compact, information-dense trading workstation. Visual hierarchy, spacing, typography, and categorical color are used to make large amounts of auction information scannable without adding unnecessary decorative elements.

## Future Enhancements

For a larger production trading application, I would consider:

- Live WebSocket or similar event-driven updates for changing auction and market data.
- Server-side pagination and sorting for substantially larger datasets.
- A dedicated summary aggregation endpoint so analytics do not require the complete filtered dataset.
- Server-supported global search.
- Request cancellation, deduplication, and server-state caching for more complex remote-data workflows.
- More visible active-filter state on compact layouts when the filter drawer is closed.
- A deeper accessibility review covering keyboard navigation, focus management, and screen-reader behavior.
- Additional auction timing and status controls as workflow requirements expand.
- Richer fixed-income analytics if additional security and market data becomes available.