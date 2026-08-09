import { useState } from 'react';

import Box from '@mui/material/Box';

import { useAuctions } from '../hooks/useAuctions';
import Header from '../components/Header';
import AuctionSummary from '../components/AuctionSummary';
import AuctionGrid from '../components/AuctionGrid';
import AuctionFilters from '../components/AuctionFilters';
import type { AuctionQuery } from '../interfaces/AuctionQuery';

export default function DashboardPage() {
  const [ query, setQuery ] = useState<AuctionQuery>({});
  const { auctions } = useAuctions(query);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
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
          overflow: 'hidden'
        }}>
        {/* main content */}
        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            gap: 2,
          }}>
          <AuctionSummary auctions={auctions} />
          <AuctionGrid auctions={auctions} />
        </Box>

        {/* filters */}
        <Box
          component="aside"
          sx={{
            minWidth: 0,
            minHeight: 0,
          }}>
          <AuctionFilters
            query={query}
            onApply={setQuery}
          />
        </Box>
      </Box>
    </Box>
  );
}