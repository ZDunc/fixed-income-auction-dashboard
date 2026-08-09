import { useMemo } from 'react';

import { ModuleRegistry, PaginationModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Box from '@mui/material/Box';

import type { Auction } from '../interfaces/Auction';
import { formatNumber, formatPrice, formatTimestamp } from '../utils/formatUtils';

ModuleRegistry.registerModules([PaginationModule]);

interface AuctionGridProps {
  auctions: Auction[];
}

export default function AuctionGrid({ auctions }: AuctionGridProps) {
  const columnDefs = useMemo<ColDef<Auction>[]>(
    () => [
      {
        field: 'cusip',
        headerName: 'CUSIP',
      },
      {
        field: 'side',
        headerName: 'Side',
      },
      {
        field: 'size',
        headerName: 'Size',
        valueFormatter: ({ value }) => formatNumber(value),
      },
      {
        field: 'productType',
        headerName: 'Product Type',
      },
      {
        field: 'price',
        headerName: 'Price',
        valueFormatter: ({ value }) => formatPrice(value),
      },
      {
        field: 'curtainTimestamp',
        headerName: 'Curtain',
        valueFormatter: ({ value }) => formatTimestamp(value),
      },
      {
        field: 'expirationTimestamp',
        headerName: 'Expiration',
        valueFormatter: ({ value }) => formatTimestamp(value),
      },
      {
        field: 'conclusionTimestamp',
        headerName: 'Conclusion',
        valueFormatter: ({ value }) => formatTimestamp(value),
      }
    ],
    []
  );

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <AgGridReact<Auction>
        rowData={auctions}
        columnDefs={columnDefs}
        pagination
      />
    </Box>
  );
}