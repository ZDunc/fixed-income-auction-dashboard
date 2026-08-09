export function formatTimestamp(value: number | null): string {
    if (value == null) {
        return '';
    }

    return new Date(value / 1_000_000).toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

export function formatPrice(value: number | null): string {
    if (value == null) {
        return '';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNumber(value: number | null): string {
    if (value == null) {
        return '';
    }

    return new Intl.NumberFormat('en-US').format(value);
}

export function formatCompactNumber(
    value: number | null,
    maximumFractionDigits = 2,
): string {
    if (value == null) {
        return '';
    }

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits,
    }).format(value);
}