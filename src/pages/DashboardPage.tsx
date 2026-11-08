import { useState } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import AuctionGrid from '../components/AuctionGrid';
import AuctionSummary from '../components/AuctionSummary';
import {
    DashboardErrorState,
    DashboardRefreshError
} from '../components/DashboardErrorStates';
import FilterPanel from '../components/FilterPanel';
import Header from '../components/Header';
import { useAuctions } from '../hooks/useAuctions';
import type { AuctionQuery } from '../interfaces/AuctionQuery';

export default function DashboardPage() {
    const theme = useTheme();

    const showPermanentFilters = useMediaQuery(
        theme.breakpoints.up('lg')
    );

    const [query, setQuery] = useState<AuctionQuery>({});
    const [filtersOpen, setFiltersOpen] = useState(false);

    const {
        auctions,
        isLoading,
        error,
        hasLoaded,
        lastUpdated,
        refetch
    } = useAuctions(query);

    const isInitialLoading =
        isLoading && !hasLoaded;

    const hasInitialError =
        !isLoading && !!error && !hasLoaded;

    const hasRefreshError =
        !isLoading && !!error && hasLoaded;

    const filterStatusText = isLoading
        ? 'Loading auctions...'
        : hasInitialError
            ? 'Results unavailable'
            : hasRefreshError
                ? 'Showing previous results'
                : undefined;

    const hasAppliedFilters =
        Object.keys(query).length > 0;

    const handleDrawerApply = (nextQuery: AuctionQuery) => {
        setQuery(nextQuery);
        setFiltersOpen(false);
    };

    return (
        <Box
            sx={{
                height: {
                    xs: 'auto',
                    lg: '100vh'
                },
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: {
                    xs: 'visible',
                    lg: 'hidden'
                },
                bgcolor: 'background.default'
            }}>
            <Header />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'minmax(0, 4fr) minmax(280px, 1fr)'
                    },
                    gap: 2,
                    p: 2,
                    overflow: {
                        xs: 'visible',
                        lg: 'hidden'
                    }
                }}>
                {/* main content */}
                <Box
                    aria-busy={isLoading}
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        display: 'grid',
                        gridTemplateRows: hasRefreshError
                            ? {
                                xs: 'auto auto 520px',
                                lg: 'auto auto minmax(0, 1fr)'
                            }
                            : {
                                xs: 'auto 520px',
                                lg: 'auto minmax(0, 1fr)'
                            },
                        alignContent: {
                            xs: 'start',
                            lg: 'stretch'
                        },
                        gap: 2
                    }}>
                    {hasInitialError ? (
                        <DashboardErrorState
                            error={error}
                            onRetry={refetch}
                        />
                    ) : (
                        <>
                            {hasRefreshError && (
                                <DashboardRefreshError
                                    onRetry={refetch}
                                />
                            )}

                            <AuctionSummary
                                auctions={auctions}
                                isLoading={isInitialLoading}
                            />

                            <AuctionGrid
                                auctions={auctions}
                                isLoading={isLoading}
                                hasAppliedFilters={hasAppliedFilters}
                                lastUpdated={lastUpdated}
                                onOpenFilters={
                                    showPermanentFilters
                                        ? undefined
                                        : () => setFiltersOpen(true)
                                }
                            />
                        </>
                    )}
                </Box>

                {/* permanent filters */}
                {showPermanentFilters && (
                    <Box
                        component="aside"
                        sx={{
                            minWidth: 0,
                            minHeight: 0
                        }}>
                        <FilterPanel
                            query={query}
                            onApply={setQuery}
                            resultCount={auctions.length}
                            isLoading={isLoading}
                            statusText={filterStatusText}
                        />
                    </Box>
                )}
            </Box>

            {/* compact-screen filters */}
            {!showPermanentFilters && (
                <Drawer
                    anchor="right"
                    open={filtersOpen}
                    onClose={() => setFiltersOpen(false)}>
                    <Box
                        sx={{
                            width: {
                                xs: '100vw',
                                sm: 360
                            },
                            height: '100%'
                        }}>
                        <FilterPanel
                            query={query}
                            onApply={handleDrawerApply}
                            resultCount={auctions.length}
                            isLoading={isLoading}
                            statusText={filterStatusText}
                        />
                    </Box>
                </Drawer>
            )}
        </Box>
    );
}