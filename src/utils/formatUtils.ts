export const NANOSECONDS_PER_MILLISECOND = 1_000_000;

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatTimestamp(
    value: number | null
): string {
    if (value == null) {
        return '—';
    }

    return new Date(
        value / NANOSECONDS_PER_MILLISECOND
    ).toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

export function formatUpdatedTime(
    timestamp: number
): string {
    return new Date(timestamp).toLocaleTimeString(
        'en-US',
        {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        }
    );
}

export function formatPrice(
    value: number | null
): string {
    if (value == null) {
        return '—';
    }

    return priceFormatter.format(value);
}

export function formatNumber(
    value: number | null
): string {
    if (value == null) {
        return '—';
    }

    return numberFormatter.format(value);
}

export function formatCompactNumber(
    value: number | null,
    maximumFractionDigits = 2
): string {
    if (value == null) {
        return '—';
    }

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits
    }).format(value);
}