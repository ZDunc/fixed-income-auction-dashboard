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
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';

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

    // calculate stats for current auctions
    // memoized to avoid unnecessary recalculation on re-render
    const stats = useMemo(
        () => getAuctionStats(auctions, currentTime),
        [auctions, currentTime]
    );

    const bidSizePercentage = getPercentage(
        stats.bidSize,
        stats.totalSize,
    );

    const offerSizePercentage = getPercentage(
        stats.offerSize,
        stats.totalSize,
    );

    const corporateCountPercentage = getPercentage(
        stats.corporateCount,
        stats.totalAuctions,
    );

    const municipalCountPercentage = getPercentage(
        stats.municipalCount,
        stats.totalAuctions,
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
                        px: 1.5,
                        py: 1
                    }}>
                    <MetricSlot isLast={false}>
                        <SummaryMetric
                            icon={<LayersOutlined />}
                            label="Total Auctions"
                            value={formatNumber(stats.totalAuctions)}
                            color={theme.kpi.auctions}
                        />
                    </MetricSlot>

                    <MetricSlot isLast={false}>
                        <SummaryMetric
                            icon={<BarChartRounded />}
                            label="Total Size"
                            value={formatCompactNumber(stats.totalSize)}
                            color={theme.kpi.size}
                        />
                    </MetricSlot>

                    <MetricSlot isLast={false}>
                        <SummaryMetric
                            icon={<AttachMoneyRounded />}
                            label="Avg Price"
                            value={formatPrice(stats.averagePrice)}
                            color={theme.kpi.price}
                        />
                    </MetricSlot>

                    <MetricSlot isLast>
                        <SummaryMetric
                            icon={<EqualizerRounded />}
                            label="Avg Size"
                            value={formatNumber(Math.round(stats.averageSize))}
                            color={theme.kpi.averageSize}
                        />
                    </MetricSlot>
                </Box>

                <Divider />

                {/* lower analytics row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '0.9fr 0.9fr 1.4fr'
                        }
                    }}>
                    <BreakdownPanel
                        title="Side Breakdown"
                        qualifier="By size"
                        tooltip="The donut represents each side's share of total auction size.">
                        <DonutBreakdown
                            percentage={bidSizePercentage}
                            primaryColor={theme.dataViz.bid}
                            secondaryColor={theme.dataViz.offer}
                            primary={
                                <LegendEntry
                                    color={theme.dataViz.bid}
                                    label="Bid"
                                    percentage={bidSizePercentage}
                                    size={stats.bidSize}
                                    count={stats.bidCount}
                                />
                            }
                            secondary={
                                <LegendEntry
                                    color={theme.dataViz.offer}
                                    label="Offer"
                                    percentage={offerSizePercentage}
                                    size={stats.offerSize}
                                    count={stats.offerCount}
                                />
                            }
                        />
                    </BreakdownPanel>

                    <BreakdownPanel
                        title="Product Breakdown"
                        qualifier="By count"
                        tooltip="The donut represents the distribution of auctions by product type."
                        divider>
                        <DonutBreakdown
                            percentage={corporateCountPercentage}
                            primaryColor={theme.dataViz.corporate}
                            secondaryColor={theme.dataViz.municipal}
                            primary={
                                <LegendEntry
                                    color={theme.dataViz.corporate}
                                    label="Corporate"
                                    percentage={corporateCountPercentage}
                                    size={stats.corporateSize}
                                    count={stats.corporateCount}
                                />
                            }
                            secondary={
                                <LegendEntry
                                    color={theme.dataViz.municipal}
                                    label="Municipal"
                                    percentage={municipalCountPercentage}
                                    size={stats.municipalSize}
                                    count={stats.municipalCount}
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
                                gridTemplateColumns: {
                                    xs: 'repeat(2, minmax(0, 1fr))',
                                    sm: 'repeat(4, minmax(0, 1fr))'
                                },
                                columnGap: 1.75,
                                minHeight: 58,
                                alignItems: 'center'
                            }}>
                            <StatusMetric
                                icon={<CalendarMonthRounded />}
                                label="Upcoming"
                                value={stats.upcomingCount}
                                color={theme.dataViz.upcoming}
                            />

                            <StatusMetric
                                icon={<PlayArrowRounded />}
                                label="Active"
                                value={stats.activeCount}
                                color={theme.dataViz.active}
                            />

                            <StatusMetric
                                icon={<CheckCircleOutlineRounded />}
                                label="Concluded"
                                value={stats.concludedCount}
                                color={theme.dataViz.concluded}
                            />

                            <StatusMetric
                                icon={<ScheduleRounded />}
                                label="Expired"
                                value={stats.expiredCount}
                                color={theme.dataViz.expired}
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
    color: string;
}

function SummaryMetric({
    icon,
    label,
    value,
    color
}: SummaryMetricProps) {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0
            }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Box
                    sx={{
                        width: 26,
                        height: 26,
                        flexShrink: 0,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha(color, 0.08),
                        color,
                        '& svg': {
                            fontSize: 16
                        }
                    }}>
                    {icon}
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.035em',
                        lineHeight: 1,
                        whiteSpace: 'nowrap'
                    }}>
                    {label}
                </Typography>
            </Stack>

            <Typography
                sx={{
                    mt: 0.35,
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                {value}
            </Typography>
        </Box>
    );
}

interface BreakdownPanelProps {
    title: string;
    qualifier?: string;
    tooltip: string;
    children: ReactNode;
    divider?: boolean;
}

function BreakdownPanel({
    title,
    qualifier,
    tooltip,
    children,
    divider = false
}: BreakdownPanelProps) {
    return (
        <Box
            sx={{
                position: 'relative',
                px: {
                    xs: 2,
                    md: 2.5
                },
                py: 1.1,
                minWidth: 0,

                ...(divider && {
                    '&::before': {
                        content: '""',
                        display: {
                            xs: 'none',
                            md: 'block'
                        },
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        bgcolor: 'divider'
                    }
                }),

                borderTop: {
                    xs: divider ? '1px solid' : 'none',
                    md: 'none'
                },
                borderColor: 'divider'
            }}>
            <Stack
                direction="row"
                spacing={0.65}
                sx={{
                    mb: 0.75,
                    alignItems: 'center'
                }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                    }}>
                    {title}
                </Typography>

                {qualifier && (
                    <Typography
                        variant="caption"
                        color="text.secondary">
                        · {qualifier}
                    </Typography>
                )}

                <Tooltip title={tooltip}>
                    <InfoOutlined
                        sx={{
                            fontSize: 14,
                            color: 'text.secondary'
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
    primary: ReactNode;
    secondary: ReactNode;
}

function DonutBreakdown({
    percentage,
    primaryColor,
    secondaryColor,
    primary,
    secondary
}: DonutBreakdownProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '58px minmax(0, 1fr)',
                alignItems: 'center',
                columnGap: 1.75,
                minHeight: 58
            }}>
            <Donut
                percentage={percentage}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />

            <Stack
                spacing={0.7}
                sx={{
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
}

function Donut({
    percentage,
    primaryColor,
    secondaryColor
}: DonutProps) {
    return (
        <Box
            sx={{
                width: 58,
                height: 58,
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
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    bgcolor: 'background.paper'
                }}
            />
        </Box>
    );
}

interface LegendEntryProps {
    color: string;
    label: string;
    percentage: number;
    size: number;
    count: number;
}

function LegendEntry({
    color,
    label,
    percentage,
    size,
    count
}: LegendEntryProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '7px minmax(0, 1fr)',
                columnGap: 0.8,
                alignItems: 'start'
            }}>
            <Box
                sx={{
                    width: 7,
                    height: 7,
                    mt: '5px',
                    borderRadius: '50%',
                    bgcolor: color
                }}
            />

            <Box sx={{ minWidth: 0 }}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        justifyContent: 'space-between'
                    }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            lineHeight: 1.15
                        }}>
                        {label}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            lineHeight: 1.15
                        }}>
                        {formatPercentage(percentage)}
                    </Typography>
                </Stack>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        mt: 0.15,
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap'
                    }}>
                    {formatCompactNumber(size, 1)} · {formatNumber(count)} auctions
                </Typography>
            </Box>
        </Box>
    );
}

interface StatusMetricProps {
    icon: ReactNode;
    label: string;
    value: number;
    color: string;
}

function StatusMetric({
    icon,
    label,
    value,
    color
}: StatusMetricProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.9,
                minWidth: 0
            }}>
            <Box
                sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: alpha(color, 0.11),
                    color,
                    '& svg': {
                        fontSize: 17
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
                        lineHeight: 1.05,
                        whiteSpace: 'nowrap'
                    }}>
                    {label}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.15,
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1.1
                    }}>
                    {formatNumber(value)}
                </Typography>
            </Box>
        </Box>
    );
}

interface MetricSlotProps {
    children: ReactNode;
    isLast: boolean;
}

function MetricSlot({
    children,
    isLast
}: MetricSlotProps) {
    return (
        <Box
            sx={{
                position: 'relative',
                minWidth: 0,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                ...(!isLast && {
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '10%',
                        bottom: '10%',
                        width: '1px',
                        bgcolor: 'divider'
                    }
                })
            }}>
            {children}
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