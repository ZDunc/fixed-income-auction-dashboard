import { useState } from 'react';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import AuctionFilters from '../components/AuctionFilters';
import AuctionGrid from '../components/AuctionGrid';
import AuctionSummary from '../components/AuctionSummary';
import { DashboardErrorState, DashboardRefreshError } from '../components/DashboardErrorStates';
import Header from '../components/Header';
import { useAuctions } from '../hooks/useAuctions';
import type { AuctionQuery } from '../interfaces/AuctionQuery';

export default function DashboardPage() {
    const [query, setQuery] = useState<AuctionQuery>({});

    const {
        auctions,
        isLoading,
        error,
        refetch
    } = useAuctions(query);

    const hasData = auctions.length > 0;

    const isInitialLoading =
        isLoading && !hasData;

    const hasInitialError =
        !isLoading && !!error && !hasData;

    const hasRefreshError =
        !isLoading && !!error && hasData;

    const filterStatusText = isLoading
        ? 'Loading auctions...'
        : error
            ? 'Results unavailable'
            : undefined;

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'background.default'
            }}>
            <Header />

            <Box
                component="main"
                sx={{
                    position: 'relative',
                    flex: 1,
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'minmax(0, 4fr) minmax(280px, 1fr)'
                    },
                    gap: 2,
                    p: 2,
                    overflow: 'hidden'
                }}>
                {/* show subtle progress while refreshing existing data */}
                {isLoading && hasData && (
                    <LinearProgress
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            zIndex: 2
                        }}
                    />
                )}

                {/* main content */}
                <Box
                    aria-busy={isLoading}
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        display: 'grid',
                        gridTemplateRows: hasRefreshError
                            ? 'auto auto minmax(0, 1fr)'
                            : 'auto minmax(0, 1fr)',
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
                        />
                        </>
                    )}
                </Box>

                {/* filters */}
                <Box
                    component="aside"
                    sx={{
                        minWidth: 0,
                        minHeight: 0
                    }}>
                    <AuctionFilters
                        query={query}
                        onApply={setQuery}
                        resultCount={auctions.length}
                        isLoading={isLoading}
                        statusText={filterStatusText}
                    />
                </Box>
            </Box>
        </Box>
    );
}