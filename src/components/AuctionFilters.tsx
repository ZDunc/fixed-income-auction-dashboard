import { useMemo, useState, type ReactNode } from 'react';

import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import FingerprintRounded from '@mui/icons-material/FingerprintRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import StraightenRounded from '@mui/icons-material/StraightenRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { AuctionQuery } from '../interfaces/AuctionQuery';
import type { ProductType, Side } from '../types/AuctionTypes';


interface FilterPanelProps {
    query: AuctionQuery;
    onApply: (query: AuctionQuery) => void;
}

interface FilterDraft {
    cusips: string;
    id: string;
    sides: Side[];
    productTypes: ProductType[];
    sizeMin: string;
    sizeMax: string;
    priceMin: string;
    priceMax: string;
}

const EMPTY_FILTERS: FilterDraft = {
    cusips: '',
    id: '',
    sides: [],
    productTypes: [],
    sizeMin: '',
    sizeMax: '',
    priceMin: '',
    priceMax: '',
};

export default function FilterPanel({
    query,
    onApply,
}: FilterPanelProps) {
    // query draft is a local state that represents the current values of the filter inputs.
    // updated as the user interacts with the filter controls.
    // when the user clicks "Apply Filters", the draft is converted back to an AuctionQuery 
    // and passed to the onApply callback
    const [draft, setDraft] = useState<FilterDraft>(
        () => queryToDraft(query)
    );

    const sizeRangeInvalid = isInvalidRange(
        draft.sizeMin,
        draft.sizeMax
    );

    const priceRangeInvalid = isInvalidRange(
        draft.priceMin,
        draft.priceMax
    );

    const activeFilterCount = useMemo(
        () => countActiveFilters(draft),
        [draft]
    );

    const handleApply = () => {
        if (sizeRangeInvalid || priceRangeInvalid) {
        return;
        }

        onApply(draftToQuery(draft));
    };

    const handleClear = () => {
        setDraft(EMPTY_FILTERS);
        onApply({});
    };

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                height: '100%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 2
            }}>
            {/* filter header */}
            <Box
                sx={{
                px: 2,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                flexShrink: 0
                }}>
                <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ alignItems: 'center' }}>
                    <FilterAltOutlined
                        color="primary"
                        sx={{ fontSize: 20 }}
                    />

                    <Typography
                        variant="subtitle1"
                        sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        }}>
                        Filters
                    </Typography>
                </Stack>

                {/* indicator for number of active filters */}
                {activeFilterCount > 0 && (
                    <Chip
                        label={activeFilterCount}
                        color="primary"
                        size="small"
                        sx={{
                        minWidth: 26,
                        height: 24,
                        fontWeight: 700,
                        }}
                    />
                )}
            </Box>

            <Divider />

            {/* filter controls */}
            <Box
                sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.25
                    }}>
                <FilterSection
                    icon={<FingerprintRounded />}
                    title="Identifiers">
                    <Stack spacing={1}>
                        <TextField
                            label="CUSIP"
                            placeholder="Comma-separated CUSIPs"
                            size="small"
                            fullWidth
                            value={draft.cusips}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    cusips: event.target.value,
                                }))
                            }
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <SearchRounded
                                            sx={{
                                                fontSize: 18,
                                                color: 'text.secondary'
                                            }}
                                        />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <TextField
                            label="Auction ID"
                            type="number"
                            size="small"
                            fullWidth
                            value={draft.id}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    id: event.target.value
                                }))
                            }
                        />
                    </Stack>
                </FilterSection>

                <Divider />

                <FilterSection
                    icon={<SwapHorizRounded />}
                    title="Side">
                    <ToggleButtonGroup
                        value={draft.sides}
                        onChange={(_, value: Side[]) =>
                            setDraft((current) => ({
                                ...current,
                                sides: value
                            }))
                        }
                        size="small"
                        fullWidth>
                        <ToggleButton
                            value="Bid"
                            sx={toggleButtonSx}>
                            Bid
                        </ToggleButton>

                        <ToggleButton
                            value="Offer"
                            sx={toggleButtonSx}>
                            Offer
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FilterSection>

                <Divider />

                <FilterSection
                    icon={<CategoryOutlined />}
                    title="Product Type">
                    <ToggleButtonGroup
                        value={draft.productTypes}
                        onChange={(_, value: ProductType[]) =>
                            setDraft((current) => ({
                                ...current,
                                productTypes: value
                            }))
                        }
                        size="small"
                        fullWidth>
                        <ToggleButton
                            value="Corporate"
                            sx={toggleButtonSx}>
                            Corporate
                        </ToggleButton>

                        <ToggleButton
                            value="Municipal"
                            sx={toggleButtonSx}>
                            Municipal
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FilterSection>

                <Divider />

                <FilterSection
                    icon={<StraightenRounded />}
                    title="Size">
                    <RangeFields
                        minLabel="Min Size"
                        maxLabel="Max Size"
                        minValue={draft.sizeMin}
                        maxValue={draft.sizeMax}
                        error={sizeRangeInvalid}
                        onMinChange={(value) =>
                            setDraft((current) => ({
                                ...current,
                                sizeMin: value
                            }))
                        }
                        onMaxChange={(value) =>
                            setDraft((current) => ({
                                ...current,
                                sizeMax: value
                            }))
                        }
                    />
                </FilterSection>

                <Divider />

                <FilterSection
                    icon={<AttachMoneyRounded />}
                    title="Price">
                    <RangeFields
                        minLabel="Min Price"
                        maxLabel="Max Price"
                        minValue={draft.priceMin}
                        maxValue={draft.priceMax}
                        error={priceRangeInvalid}
                        onMinChange={(value) =>
                            setDraft((current) => ({
                                ...current,
                                priceMin: value
                            }))
                        }
                        onMaxChange={(value) =>
                            setDraft((current) => ({
                                ...current,
                                priceMax: value
                            }))
                        }
                    />
                </FilterSection>
            </Box>

            <Divider />

            {/* reset and apply  */}
            <Box
                sx={{
                    p: 1.25,
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 1,
                    flexShrink: 0,
                    bgcolor: 'background.paper'
                }}>
                <Button
                    variant="text"
                    color="inherit"
                    startIcon={<RestartAltRounded />}
                    onClick={handleClear}
                    disabled={activeFilterCount === 0}
                    sx={{
                        px: 1,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                    }}>
                    Clear
                </Button>

                <Button
                    variant="contained"
                    startIcon={<FilterAltOutlined />}
                    onClick={handleApply}
                    disabled={sizeRangeInvalid || priceRangeInvalid}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                    }}>
                    Apply Filters
                </Button>
            </Box>
        </Card>
    );
}

interface FilterSectionProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}

function FilterSection({
    icon,
    title,
    children,
}: FilterSectionProps) {
    return (
        <Box>
        <Stack
            direction="row"
            spacing={0.65}
            sx={{ mb: 0.75, alignItems: 'center' }}>
            <Box
                sx={{
                    display: 'grid',
                    placeItems: 'center',
                    color: 'text.secondary',
                    '& svg': {
                        fontSize: 16
                    }
                }}>
                {icon}
            </Box>

            <Typography
                variant="caption"
                sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                }}>
                {title}
            </Typography>
        </Stack>

        {children}
        </Box>
    );
}

interface RangeFieldsProps {
    minLabel: string;
    maxLabel: string;
    minValue: string;
    maxValue: string;
    error: boolean;
    onMinChange: (value: string) => void;
    onMaxChange: (value: string) => void;
}

function RangeFields({
    minLabel,
    maxLabel,
    minValue,
    maxValue,
    error,
    onMinChange,
    onMaxChange
}: RangeFieldsProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1
            }}>
            <TextField
                label={minLabel}
                type="number"
                size="small"
                fullWidth
                value={minValue}
                error={error}
                onChange={(event) =>
                    onMinChange(event.target.value)
                }
            />

            <TextField
                label={maxLabel}
                type="number"
                size="small"
                fullWidth
                value={maxValue}
                error={error}
                helperText={
                error
                    ? 'Max must be greater than or equal to min'
                    : undefined
                }
                onChange={(event) =>
                    onMaxChange(event.target.value)
                }
            />
        </Box>
    );
}

const toggleButtonSx = {
    flex: 1,
    py: 0.75,
    textTransform: 'none',
    fontWeight: 600
};

function queryToDraft(
    query: AuctionQuery
): FilterDraft {
    return {
        cusips: query.cusips?.join(', ') ?? '',
        id: query.id?.toString() ?? '',
        sides: query.sides ?? [],
        productTypes: query.productTypes ?? [],
        sizeMin: query.sizeMin?.toString() ?? '',
        sizeMax: query.sizeMax?.toString() ?? '',
        priceMin: query.priceMin?.toString() ?? '',
        priceMax: query.priceMax?.toString() ?? ''
    };
}

function draftToQuery(
    draft: FilterDraft
): AuctionQuery {
    const cusips = draft.cusips
        .split(',')
        .map((cusip) => cusip.trim())
        .filter(Boolean);

    return {
        ...(cusips.length > 0 && {
            cusips,
        }),

        ...(draft.id !== '' && {
            id: Number(draft.id),
        }),

        ...(draft.sides.length > 0 && {
            sides: draft.sides,
        }),

        ...(draft.productTypes.length > 0 && {
            productTypes: draft.productTypes,
        }),

        ...(draft.sizeMin !== '' && {
            sizeMin: Number(draft.sizeMin),
        }),

        ...(draft.sizeMax !== '' && {
            sizeMax: Number(draft.sizeMax),
        }),

        ...(draft.priceMin !== '' && {
            priceMin: Number(draft.priceMin),
        }),

        ...(draft.priceMax !== '' && {
            priceMax: Number(draft.priceMax),
        }),
    };
}

function isInvalidRange(
    minValue: string,
    maxValue: string
): boolean {
    if (minValue === '' || maxValue === '') {
        return false;
    }

    return Number(minValue) > Number(maxValue);
}

function countActiveFilters(draft: FilterDraft): number {
    let count = 0;

    if (draft.cusips.trim()) count += 1;
    if (draft.id) count += 1;
    if (draft.sides.length > 0) count += 1;
    if (draft.productTypes.length > 0) count += 1;
    if (draft.sizeMin || draft.sizeMax) count += 1;
    if (draft.priceMin || draft.priceMax) count += 1;

    return count;
}