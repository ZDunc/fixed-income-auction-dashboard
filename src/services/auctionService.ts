import type { AuctionQuery } from '../interfaces/AuctionQuery';
import type { AuctionResponse } from '../interfaces/AuctionResponse';

import { mockAuctions } from '../mocks/mockAuctions';
import { filterAuctions } from '../utils/filterAuctions';

/*
 * Portfolio/demo implementation.
 *
 * The original application consumed auction data from an external API.
 * Because that API is no longer available, the public version uses
 * synthetic local data while preserving the same service interface.
 *
 * Filtering is applied here so the rest of the application can continue
 * treating this service as the source of the filtered auction dataset.
 */
export async function getAuctions(
    query: AuctionQuery = {}
): Promise<AuctionResponse> {
    const filteredAuctions = filterAuctions(
        mockAuctions,
        query
    );

    return {
        data: filteredAuctions
    };
}

/**
 * Original API-backed implementation.
 *
 * The API URL was supplied externally through Vite environment variables
 * rather than being hardcoded in the application. This version is retained
 * for reference to show how the dashboard integrates with a remote service.
 *
 * To restore API-backed behavior, provide VITE_API_URL and use this
 * implementation instead of the local mock implementation above.
 */

// const API_URL = import.meta.env.VITE_API_URL;

// export async function getAuctionsFromApi(
//     query: AuctionQuery = {}
// ): Promise<AuctionResponse> {
//     if (!API_URL) {
//         throw new Error(
//             'VITE_API_URL is not configured'
//         );
//     }

//     const response = await fetch(`${API_URL}/api/data`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(query)
//     });

//     if (!response.ok) {
//         throw new Error(
//             `Failed to fetch auctions: ${response.status} ${response.statusText}`
//         );
//     }

//     const result: unknown = await response.json();

//     if (Array.isArray(result)) {
//         return {
//             data: result as Auction[]
//         };
//     }

//     if (
//         result &&
//         typeof result === 'object' &&
//         'data' in result &&
//         Array.isArray(result.data)
//     ) {
//         return result as AuctionResponse;
//     }

//     throw new Error('Unexpected API response format');
// }