import { useMemo, useState } from 'react';

import {
    CellStyleModule,
    ModuleRegistry,
    PaginationModule,
    QuickFilterModule
} from 'ag-grid-community';
import type {
    ColDef,
    ICellRendererParams
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';

import type { Auction } from '../interfaces/Auction';
import { auctionGridTheme } from '../theme/theme';
import type {
    ProductType,
    Side
} from '../types/AuctionTypes';
import {
    formatNumber,
    formatPrice,
    formatTimestamp
} from '../utils/formatUtils';

import AuctionGridToolbar from './AuctionGridToolbar';


ModuleRegistry.registerModules([
    PaginationModule,
    QuickFilterModule,
    CellStyleModule
]);

interface AuctionGridProps {
    auctions: Auction[];
}

export default function AuctionGrid({
    auctions
}: AuctionGridProps) {
    const [quickFilterText, setQuickFilterText] = useState('');
    const [displayedCount, setDisplayedCount] = useState(auctions.length);

	const overlayComponentParams = useMemo(
    () => ({
        noRows: {
            overlayText:
                'No auctions match the applied filters. Try adjusting or clearing your filters.'
        },
        noMatchingRows: {
            overlayText:
                'No auctions match your search. Try another ID, CUSIP, value, or date/time.'
        }
    }),
    []
);

    const defaultColDef = useMemo<ColDef<Auction>>(
        () => ({
            sortable: true,
            resizable: true,
            minWidth: 90
        }),
        []
    );

    const columnDefs = useMemo<ColDef<Auction>[]>(
        () => [
            {
                field: 'id',
                headerName: 'ID',
                width: 75,
                minWidth: 70,
                maxWidth: 90,
                cellClass: 'tabular-numbers'
            },
            {
                field: 'cusip',
                headerName: 'CUSIP',
                flex: 1,
                minWidth: 115,
                cellStyle: {
                    fontWeight: 600
                }
            },
            {
                field: 'side',
                headerName: 'Side',
                width: 95,
                minWidth: 90,
                maxWidth: 105,
                cellRenderer: SideCellRenderer
            },
            {
                field: 'size',
                headerName: 'Size',
                width: 110,
                minWidth: 100,
                maxWidth: 120,
                valueFormatter: ({ value }) =>
                    formatNumber(value),
                getQuickFilterText: ({ value }) =>
                    value == null
                        ? ''
                        : formatNumber(value),
                cellClass: 'tabular-numbers'
            },
            {
                field: 'productType',
                headerName: 'Product Type',
                flex: 1,
                minWidth: 125,
                cellRenderer: ProductTypeCellRenderer
            },
            {
                field: 'price',
                headerName: 'Price',
                width: 105,
                minWidth: 100,
                maxWidth: 115,
                valueFormatter: ({ value }) =>
                    formatPrice(value),
                getQuickFilterText: ({ value }) =>
                    value == null
                        ? ''
                        : formatPrice(value),
                cellClass: 'tabular-numbers'
            },
            {
                field: 'curtainTimestamp',
                headerName: 'Curtain',
                flex: 1.2,
                minWidth: 150,
                valueFormatter: ({ value }) =>
                    formatTimestamp(value),
                getQuickFilterText: ({ value }) =>
                    value == null
                        ? ''
                        : formatTimestamp(value),
                cellClass: 'tabular-numbers'
            },
            {
                field: 'expirationTimestamp',
                headerName: 'Expiration',
                flex: 1.2,
                minWidth: 150,
                valueFormatter: ({ value }) =>
                    formatTimestamp(value),
                getQuickFilterText: ({ value }) =>
                    value == null
                        ? ''
                        : formatTimestamp(value),
                cellClass: 'tabular-numbers'
            },
            {
                field: 'conclusionTimestamp',
                headerName: 'Conclusion',
                flex: 1.2,
                minWidth: 150,
                valueFormatter: ({ value }) =>
                    formatTimestamp(value),
                getQuickFilterText: ({ value }) =>
                    value == null
                        ? ''
                        : formatTimestamp(value),
                cellClass: 'tabular-numbers'
            }
        ],
        []
    );

    return (
        <Box
            sx={{
                height: '100%',
                minHeight: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                boxShadow:
                    '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.05)'
            }}>
            <AuctionGridToolbar
                totalCount={auctions.length}
                displayedCount={displayedCount}
                searchText={quickFilterText}
                onSearchChange={setQuickFilterText}
            />

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    borderTop: 1,
                    borderColor: 'divider'
                }}>
                <AgGridReact<Auction>
                    theme={auctionGridTheme}
                    rowData={auctions}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    paginationPageSize={25}
                    paginationPageSizeSelector={[
                        10,
                        25,
                        50,
                        100
                    ]}
                    alwaysShowVerticalScroll
                    quickFilterText={quickFilterText}
					overlayComponentParams={overlayComponentParams}
                    onFilterChanged={(event) =>
                        setDisplayedCount(
                            event.api.getDisplayedRowCount()
                        )
                    }
                    onModelUpdated={(event) =>
                        setDisplayedCount(
                            event.api.getDisplayedRowCount()
                        )
                    }
                />
            </Box>
        </Box>
    );
}

function SideCellRenderer({
    value
}: ICellRendererParams<Auction, Side>) {
    const theme = useTheme();

    if (!value) {
        return null;
    }

    const color =
        value === 'Bid'
            ? theme.dataViz.bid
            : theme.dataViz.offer;

    return (
        <Chip
            label={value}
            size="small"
            sx={{
                height: 21,
                color,
                bgcolor: alpha(color, 0.11),
                borderRadius: 1.5,
                fontSize: '0.72rem',
                fontWeight: 700
            }}
        />
    );
}

function ProductTypeCellRenderer({
    value
}: ICellRendererParams<Auction, ProductType>) {
    const theme = useTheme();

    if (!value) {
        return null;
    }

    const color =
        value === 'Corporate'
            ? theme.dataViz.corporate
            : theme.dataViz.municipal;

    return (
        <Chip
            label={value}
            size="small"
            sx={{
                height: 21,
                color,
                bgcolor: alpha(color, 0.10),
                borderRadius: 1.5,
                fontSize: '0.72rem',
                fontWeight: 700
            }}
        />
    );
}