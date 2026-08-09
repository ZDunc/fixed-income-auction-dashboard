import { useMemo, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import EqualizerRounded from '@mui/icons-material/EqualizerRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';

import type { Auction } from '../interfaces/Auction';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { getAuctionStats } from '../utils/auctionStats';
import { formatCompactNumber, formatNumber, formatPrice } from '../utils/formatUtils';


interface AuctionSummaryProps {
    auctions: Auction[];
}

export default function AuctionSummary({
    auctions
}: AuctionSummaryProps) {
    const theme = useTheme();
    const currentTime = useCurrentTime();

    // calcualte stats for current auctions
    // memoized to avoid unnecessary recalculation on re-render
    const stats = useMemo(
        () => getAuctionStats(auctions, currentTime),
        [auctions, currentTime]
    );

    const bidSizePercentage = getPercentage(
        stats.bidSize,
        stats.totalSize
    );

    const corporateCountPercentage = getPercentage(
        stats.corporateCount,
        stats.totalAuctions
    );

    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: 'background.paper',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
            }}>
            <CardContent
                sx={{
                    p: 0,
                    '&:last-child': {
                        pb: 0
                    }
                }}>
                {/* top KPI row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(4, minmax(0, 1fr))'
                        },
                        px: 3,
                        py: 1.5
                    }}>
                    <SummaryMetric
                        icon={<LayersOutlined />}
                        label="Total Auctions"
                        value={formatNumber(stats.totalAuctions)}
                        detail="Current results"
                        color={theme.palette.primary.main}
                    />

                    <SummaryMetric
                        icon={<BarChartRounded />}
                        label="Total Size"
                        value={formatCompactNumber(stats.totalSize)}
                        detail="Combined auction size"
                        color={theme.palette.success.main}
                        divider
                    />

                    <SummaryMetric
                        icon={<AttachMoneyRounded />}
                        label="Avg Price"
                        value={formatPrice(stats.averagePrice)}
                        detail="Across current results"
                        color={theme.palette.secondary.main}
                        divider
                    />

                    <SummaryMetric
                        icon={<EqualizerRounded />}
                        label="Avg Size"
                        value={formatNumber(Math.round(stats.averageSize))}
                        detail="Per auction"
                        color={theme.palette.warning.dark}
                        divider
                    />
                </Box>

                <Divider />

                {/* lower analytics row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr 1.15fr'
                        }
                    }}>
                    <BreakdownPanel
                        title="Side Breakdown"
                        tooltip="The donut represents each side's share of total auction size.">
                        <DonutBreakdown
                            centerLabel="Size"
                            percentage={bidSizePercentage}
                            primaryColor={theme.palette.primary.main}
                            secondaryColor={theme.palette.success.main}
                            primary={
                                <LegendEntry
                                    color={theme.palette.primary.main}
                                    label="Bid"
                                    count={stats.bidCount}
                                    countPercentage={getPercentage(
                                        stats.bidCount,
                                        stats.totalAuctions
                                    )}
                                    size={stats.bidSize}
                                    sizePercentage={bidSizePercentage}
                                />
                            }
                            secondary={
                                <LegendEntry
                                    color={theme.palette.success.main}
                                    label="Offer"
                                    count={stats.offerCount}
                                    countPercentage={getPercentage(
                                        stats.offerCount,
                                        stats.totalAuctions
                                    )}
                                    size={stats.offerSize}
                                    sizePercentage={getPercentage(
                                        stats.offerSize,
                                        stats.totalSize
                                    )}
                                />
                            }
                        />
                    </BreakdownPanel>

                    <BreakdownPanel
                        title="Product Breakdown"
                        tooltip="The donut represents the distribution of auctions by product type."
                        divider>
                        <DonutBreakdown
                            centerLabel="Count"
                            percentage={corporateCountPercentage}
                            primaryColor={theme.palette.secondary.main}
                            secondaryColor={theme.palette.warning.main}
                            primary={
                                <LegendEntry
                                    color={theme.palette.secondary.main}
                                    label="Corporate"
                                    count={stats.corporateCount}
                                    countPercentage={corporateCountPercentage}
                                    size={stats.corporateSize}
                                    sizePercentage={getPercentage(
                                        stats.corporateSize,
                                        stats.totalSize
                                    )}
                                />
                            }
                            secondary={
                                <LegendEntry
                                    color={theme.palette.warning.main}
                                    label="Municipal"
                                    count={stats.municipalCount}
                                    countPercentage={getPercentage(
                                        stats.municipalCount,
                                        stats.totalAuctions
                                    )}
                                    size={stats.municipalSize}
                                    sizePercentage={getPercentage(
                                        stats.municipalSize,
                                        stats.totalSize
                                    )}
                                />
                            }
                        />
                    </BreakdownPanel>

                    <BreakdownPanel
                        title="Status"
                        tooltip="Auction status is derived from curtain, expiration, and conclusion timestamps."
                        divider>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 1,
                                minHeight: 88,
                                alignItems: 'center'
                            }}>
                            <StatusMetric
                                icon={<CalendarMonthRounded />}
                                label="Upcoming"
                                value={stats.upcomingCount}
                                percentage={getPercentage(
                                    stats.upcomingCount,
                                    stats.totalAuctions
                                )}
                                color={theme.palette.primary.main}
                            />

                            <StatusMetric
                                icon={<PlayArrowRounded />}
                                label="Active"
                                value={stats.activeCount}
                                percentage={getPercentage(
                                    stats.activeCount,
                                    stats.totalAuctions
                                )}
                                color={theme.palette.success.main}
                            />

                            <StatusMetric
                                icon={<CheckCircleOutlineRounded />}
                                label="Concluded"
                                value={stats.concludedCount}
                                percentage={getPercentage(
                                    stats.concludedCount,
                                    stats.totalAuctions
                                )}
                                color={theme.palette.secondary.main}
                            />
                        </Box>
                    </BreakdownPanel>
                </Box>
            </CardContent>
        </Card>
    );
}

interface SummaryMetricProps {
    icon: ReactNode;
    label: string;
    value: string;
    detail: string;
    color: string;
    divider?: boolean;
}

function SummaryMetric({
    icon,
    label,
    value,
    detail,
    color,
    divider = false,
}: SummaryMetricProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.75,
                minWidth: 0,
                px: {
                    xs: 1,
                    md: 2.5
                },
                py: {
                    xs: 1,
                    md: 0
                },
                borderLeft: {
                    xs: 'none',
                    md: divider ? '1px solid' : 'none'
                },
                borderColor: 'divider'
            }}>
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: alpha(color, 0.12),
                    color,
                    '& svg': {
                        fontSize: 22
                    }
                }}>
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        lineHeight: 1.3,
                    }}>
                    {label}
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        mt: 0.25,
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        whiteSpace: 'nowrap'
                    }}>
                    {value}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        mt: 0.15,
                        whiteSpace: 'nowrap'
                    }}>
                    {detail}
                </Typography>
            </Box>
        </Box>
    );
}

interface BreakdownPanelProps {
    title: string;
    tooltip: string;
    children: ReactNode;
    divider?: boolean;
}

function BreakdownPanel({
    title,
    tooltip,
    children,
    divider = false
}: BreakdownPanelProps) {
    return (
        <Box
            sx={{
                px: 3,
                py: 1.25,
                minWidth: 0,
                borderLeft: {
                    xs: 'none',
                    md: divider ? '1px solid' : 'none'
                },
                borderTop: {
                    xs: divider ? '1px solid' : 'none',
                    md: 'none'
                },
                borderColor: 'divider'
            }}>
            <Stack
                direction="row"
                spacing={0.75}
                sx={{ mb: 1.5, alignItems: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                    }}>
                    {title}
                </Typography>

                <Tooltip title={tooltip}>
                <InfoOutlined
                    sx={{
                    fontSize: 15,
                    color: 'text.secondary',
                    }}
                />
                </Tooltip>
            </Stack>

            {children}
        </Box>
    );
}

interface DonutBreakdownProps {
    percentage: number;
    primaryColor: string;
    secondaryColor: string;
    centerLabel: string;
    primary: ReactNode;
    secondary: ReactNode;
}

function DonutBreakdown({
    percentage,
    primaryColor,
    secondaryColor,
    centerLabel,
    primary,
    secondary,
}: DonutBreakdownProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.25,
                minHeight: 88
            }}>
            <Donut
                percentage={percentage}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                centerLabel={centerLabel}
            />

            <Stack
                spacing={1}
                sx={{
                    flex: 1,
                    minWidth: 0
                }}>
                {primary}
                {secondary}
            </Stack>
        </Box>
    );
}

interface DonutProps {
    percentage: number;
    primaryColor: string;
    secondaryColor: string;
    centerLabel: string;
}

function Donut({
    percentage,
    primaryColor,
    secondaryColor,
    centerLabel
}: DonutProps) {
    return (
        <Box
            sx={{
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: '50%',
                background: `conic-gradient(
                ${primaryColor} 0% ${percentage}%,
                ${secondaryColor} ${percentage}% 100%
                )`,
                display: 'grid',
                placeItems: 'center'
            }}>
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    display: 'grid',
                    placeItems: 'center'
                }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.62rem',
                        letterSpacing: '0.05em'
                    }}>
                    {centerLabel}
                </Typography>
            </Box>
        </Box>
    );
}

interface LegendEntryProps {
    color: string;
    label: string;
    count: number;
    countPercentage: number;
    size: number;
    sizePercentage: number;
}

function LegendEntry({
    color,
    label,
    count,
    countPercentage,
    size,
    sizePercentage
}: LegendEntryProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '8px minmax(0, 1fr)',
                columnGap: 1,
                alignItems: 'start'
            }}>
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    mt: '5px',
                    borderRadius: '50%',
                    bgcolor: color
                }}
            />

            <Box sx={{ minWidth: 0 }}>
                <Stack
                direction="row"
                spacing={1}
                sx= {{ justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 500 }}>
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                    }}>
                    {formatNumber(count)} ({formatPercentage(countPercentage)})
                </Typography>
                </Stack>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}>
                    {formatCompactNumber(size, 1)} size ·{' '}
                    {formatPercentage(sizePercentage)}
                </Typography>
            </Box>
        </Box>
    );
}

interface StatusMetricProps {
    icon: ReactNode;
    label: string;
    value: number;
    percentage: number;
    color: string;
}

function StatusMetric({
    icon,
    label,
    value,
    percentage,
    color
}: StatusMetricProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0
            }}>
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: alpha(color, 0.12),
                    color,
                    '& svg': {
                        fontSize: 21,
                    }
                }}>
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        lineHeight: 1.2
                    }}>
                    {label}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.25,
                    }}>
                    {formatNumber(value)}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary">
                    {formatPercentage(percentage)}
                </Typography>
            </Box>
        </Box>
    );
}

function getPercentage(
    value: number,
    total: number
): number {
    return total > 0 ? (value / total) * 100 : 0;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}