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
import { formatNumber } from '../utils/formatUtils';


interface FilterPanelProps {
    query: AuctionQuery;
    onApply: (query: AuctionQuery) => void;
    resultCount: number;
    statusText?: string;
    isLoading?: boolean;
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
    priceMax: ''
};

export default function FilterPanel({
    query,
    onApply,
    resultCount,
    statusText,
    isLoading = false
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

    const draftFilterCount = useMemo(
        () => countActiveFilters(draft),
        [draft]
    );

    const appliedFilterCount = useMemo(
        () => countActiveFilters(queryToDraft(query)),
        [query]
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
                    py: 1.35,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    flexShrink: 0,
                    bgcolor: 'action.hover'
                }}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: 'center'
                    }}>
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            flexShrink: 0,
                            borderRadius: 1.5,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'action.selected',
                            color: 'primary.main'
                        }}>
                        <FilterAltOutlined
                            sx={{
                                fontSize: 18
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.15
                            }}>
                            Filters
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: 'block',
                                mt: 0.15,
                                lineHeight: 1.2
                            }}>
                            {statusText ??
                                `${formatNumber(resultCount)} ${
                                    appliedFilterCount > 0
                                        ? 'matching '
                                        : ''
                                }${resultCount === 1 ? 'auction' : 'auctions'}`
                            }
                        </Typography>
                    </Box>
                </Stack>

                {appliedFilterCount > 0 && (
                    <Chip
                        label={appliedFilterCount}
                        color="primary"
                        size="small"
                        sx={{
                            minWidth: 26,
                            height: 24
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
                    py: 1.85,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.6
                }}>
                <FilterSection
                    icon={<FingerprintRounded />}
                    title="Identifiers">
                    <Stack spacing={1.3}>
                        <TextField
                            label="CUSIP"
                            placeholder="Comma-separated CUSIPs"
                            size="small"
                            fullWidth
                            value={draft.cusips}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    cusips: event.target.value
                                }))
                            }
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
                            onChange={(event) => {
                                const value = event.target.value;

                                if (
                                    value === '' ||
                                    (/^\d+$/.test(value) && Number(value) >= 1)
                                ) {
                                    setDraft((current) => ({
                                        ...current,
                                        id: value
                                    }));
                                }
                            }}
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                    step: 1
                                }
                            }}
                        />
                    </Stack>
                </FilterSection>

                <SectionDivider />

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

                <SectionDivider />

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

                <SectionDivider />

                <FilterSection
                    icon={<StraightenRounded />}
                    title="Size">
                    <RangeFields
                        minLabel="Min Size"
                        maxLabel="Max Size"
                        minValue={draft.sizeMin}
                        maxValue={draft.sizeMax}
                        error={sizeRangeInvalid}
                        min={0}
                        step={1}
                        maxDecimalPlaces={0}
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
                <SectionDivider />

                <FilterSection
                    icon={<AttachMoneyRounded />}
                    title="Price">
                    <RangeFields
                        minLabel="Min Price"
                        maxLabel="Max Price"
                        minValue={draft.priceMin}
                        maxValue={draft.priceMax}
                        error={priceRangeInvalid}
                        min={0}
                        step={0.01}
                        maxDecimalPlaces={2}
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

            {/* reset and apply */}
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
                    disabled={
                        draftFilterCount === 0 &&
                        appliedFilterCount === 0
                    }
                    sx={{
                        px: 1,
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                    }}>
                    Clear
                </Button>

                <Button
                    variant="contained"
                    startIcon={<FilterAltOutlined />}
                    onClick={handleApply}
                    disabled={
                        isLoading ||
                        sizeRangeInvalid ||
                        priceRangeInvalid
                    }
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600
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
    children
}: FilterSectionProps) {
    return (
        <Box
            sx={{
                py: 0.2
            }}>
            <Stack
                direction="row"
                spacing={0.8}
                sx={{
                    mb: 1.2,
                    alignItems: 'center'
                }}>
                <Box
                    sx={{
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        color: 'primary.main',
                        opacity: 0.78,
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
                        lineHeight: 1.2
                    }}>
                    {title}
                </Typography>
            </Stack>

            {children}
        </Box>
    );
}

function SectionDivider() {
    return (
        <Divider
            sx={{
                borderColor: 'divider'
            }}
        />
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
    min?: number;
    step?: number | 'any';
    maxDecimalPlaces?: number;
}

function RangeFields({
    minLabel,
    maxLabel,
    minValue,
    maxValue,
    error,
    min = 0,
    step,
    maxDecimalPlaces,
    onMinChange,
    onMaxChange
}: RangeFieldsProps) {
    const handleChange = (
        value: string,
        onChange: (value: string) => void
    ) => {
        if (
            isValidNumericInput(
                value,
                min,
                maxDecimalPlaces
            )
        ) {
            onChange(value);
        }
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.15
            }}>
            <TextField
                label={minLabel}
                type="number"
                size="small"
                fullWidth
                value={minValue}
                onChange={(event) =>
                    handleChange(
                        event.target.value,
                        onMinChange
                    )
                }
                error={error}
                slotProps={{
                    htmlInput: {
                        min,
                        step
                    }
                }}
            />

            <TextField
                label={maxLabel}
                type="number"
                size="small"
                fullWidth
                value={maxValue}
                onChange={(event) =>
                    handleChange(
                        event.target.value,
                        onMaxChange
                    )
                }
                error={error}
                helperText={
                    error
                        ? 'Max must be greater than or equal to min'
                        : undefined
                }
                slotProps={{
                    htmlInput: {
                        min,
                        step
                    }
                }}
            />
        </Box>
    );
}

const toggleButtonSx = {
    flex: 1,
    py: 0.75
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
    const cusips = [
        ...new Set(
            draft.cusips
                .split(',')
                .map((cusip) => cusip.trim().toUpperCase())
                .filter(Boolean)
        )
    ];

    return {
        ...(cusips.length > 0 && {
            cusips
        }),

        ...(draft.id !== '' && {
            id: Number(draft.id)
        }),

        ...(draft.sides.length > 0 && {
            sides: draft.sides
        }),

        ...(draft.productTypes.length > 0 && {
            productTypes: draft.productTypes
        }),

        ...(draft.sizeMin !== '' && {
            sizeMin: Number(draft.sizeMin)
        }),

        ...(draft.sizeMax !== '' && {
            sizeMax: Number(draft.sizeMax)
        }),

        ...(draft.priceMin !== '' && {
            priceMin: Number(draft.priceMin)
        }),

        ...(draft.priceMax !== '' && {
            priceMax: Number(draft.priceMax)
        })
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

function isValidNumericInput(
    value: string,
    min: number,
    maxDecimalPlaces?: number
): boolean {
    if (value === '') {
        return true;
    }

    const decimalPattern =
        maxDecimalPlaces === undefined
            ? /^\d+(\.\d*)?$/
            : new RegExp(
                `^\\d+(\\.\\d{0,${maxDecimalPlaces}})?$`
            );

    if (!decimalPattern.test(value)) {
        return false;
    }

    const numericValue = Number(value);

    return (
        Number.isFinite(numericValue) &&
        numericValue >= min
    );
}