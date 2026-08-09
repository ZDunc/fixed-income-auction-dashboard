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
        flex: 1
      },
      {
        field: 'side',
        headerName: 'Side',
        flex: 1
      },
      {
       field: 'size',
        headerName: 'Size',
        flex: 1,
        valueFormatter: ({ value }) => formatNumber(value)
      },
      {
        field: 'productType',
        headerName: 'Product Type',
        flex: 1
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 1,
        valueFormatter: ({ value }) => formatPrice(value)
      },
      {
        field: 'curtainTimestamp',
        headerName: 'Curtain',
        flex: 1.5,
        valueFormatter: ({ value }) => formatTimestamp(value)
      },
      {
        field: 'expirationTimestamp',
        headerName: 'Expiration',
        flex: 1.5,
        valueFormatter: ({ value }) => formatTimestamp(value)
      },
      {
        field: 'conclusionTimestamp',
        headerName: 'Conclusion',
        flex: 1.5,
        valueFormatter: ({ value }) => formatTimestamp(value)
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