import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ClearRounded from '@mui/icons-material/ClearRounded';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TableRowsOutlined from '@mui/icons-material/TableRowsOutlined';

import {
    formatNumber,
    formatUpdatedTime
} from '../utils/formatUtils';

interface AuctionGridToolbarProps {
    totalCount: number;
    displayedCount: number;
    searchText: string;
    lastUpdated: number | null;
    activeFilterCount: number;
    onSearchChange: (value: string) => void;
    onOpenFilters?: () => void;
}

export default function AuctionGridToolbar({
    totalCount,
    displayedCount,
    searchText,
    lastUpdated,
    activeFilterCount,
    onSearchChange,
    onOpenFilters
}: AuctionGridToolbarProps) {
    const hasSearch = searchText.trim().length > 0;
    const hasAppliedFilters = activeFilterCount > 0;

    const safeDisplayedCount =
        Number.isFinite(displayedCount)
            ? displayedCount
            : totalCount;

    return (
        <Box
            sx={{
                minHeight: 46,
                px: 1.75,
                py: {
                    xs: 0.75,
                    sm: 0
                },
                display: 'flex',
                alignItems: {
                    xs: 'stretch',
                    sm: 'center'
                },
                justifyContent: 'space-between',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                },
                gap: {
                    xs: 1,
                    sm: 2
                },
                bgcolor: 'background.paper'
            }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: 'center'
                }}>
                <TableRowsOutlined
                    color="primary"
                    sx={{
                        fontSize: 19
                    }}
                />

                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700
                    }}>
                    Auctions
                </Typography>

                {hasSearch && (
                    <Chip
                        label={`${formatNumber(safeDisplayedCount)} of ${formatNumber(totalCount)}`}
                        size="small"
                        sx={{
                            height: 22,
                            px: 0.25,
                            bgcolor: 'action.hover',
                            color: 'text.secondary',
                            border: 0,
                            fontSize: '0.7rem',
                            fontWeight: 600
                        }}
                    />
                )}

                {lastUpdated !== null && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block'
                            },
                            ml: 0.25,
                            fontSize: '0.68rem',
                            whiteSpace: 'nowrap'
                        }}>
                        Updated {formatUpdatedTime(lastUpdated)}
                    </Typography>
                )}
            </Stack>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: 'center',
                    width: {
                        xs: '100%',
                        sm: 'auto'
                    }
                }}>
                {onOpenFilters && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FilterAltOutlined />}
                        onClick={onOpenFilters}
                        sx={{
                            height: 34,
                            px: {
                                xs: 1.5,
                                sm: 1.35
                            },
                            whiteSpace: 'nowrap',

                            '& .MuiButton-startIcon': {
                                ml: 0,
                                mr: 0.75
                            },

                            ...(hasAppliedFilters && {
                                bgcolor: 'action.selected',
                                borderColor: 'primary.main',

                                '&:hover': {
                                    bgcolor: 'action.selected',
                                    borderColor: 'primary.main'
                                }
                            })
                        }}>
                        Filters

                        {hasAppliedFilters && (
                            <Box
                                component="span"
                                sx={{
                                    ml: 0.75,
                                    minWidth: 18,
                                    height: 18,
                                    px: 0.45,
                                    borderRadius: 9,
                                    display: 'inline-grid',
                                    placeItems: 'center',
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    lineHeight: 1
                                }}>
                                {activeFilterCount}
                            </Box>
                        )}
                    </Button>
                )}

                <Tooltip
                    title="Search across auction fields, including formatted prices and date/times"
                    placement="bottom">
                    <TextField
                        value={searchText}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search auctions"
                        size="small"
                        sx={{
                            width: {
                                xs: '100%',
                                sm: 240
                            },

                            '& .MuiInputBase-root': {
                                height: 34
                            },

                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem'
                            }
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRounded
                                            sx={{
                                                fontSize: 17,
                                                color: 'text.secondary'
                                            }}
                                        />
                                    </InputAdornment>
                                ),

                                endAdornment: searchText ? (
                                    <InputAdornment position="end">
                                        <Tooltip title="Clear search">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    onSearchChange('')
                                                }
                                                edge="end"
                                                aria-label="Clear table search">
                                                <ClearRounded
                                                    sx={{
                                                        fontSize: 17
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ) : undefined
                            }
                        }}
                    />
                </Tooltip>
            </Stack>
        </Box>
    );
}