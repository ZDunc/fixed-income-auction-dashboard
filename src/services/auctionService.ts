import type { Auction } from '../interfaces/Auction';
import type { AuctionQuery } from '../interfaces/AuctionQuery';
import type { AuctionResponse } from '../interfaces/AuctionResponse';

const API_URL = import.meta.env.VITE_API_URL;

export async function getAuctions(
    query: AuctionQuery = {}
): Promise<AuctionResponse> {
    const response = await fetch(`${API_URL}/api/data`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch auctions: ${response.status}`);
    }

    const result: unknown = await response.json();

    if (Array.isArray(result)) {
        return {
            data: result as Auction[]
        };
    }

    if (
        result &&
        typeof result === 'object' &&
        'data' in result &&
        Array.isArray(result.data)
    ) {
        return result as AuctionResponse;
    }

    throw new Error('Unexpected API response format');
}