import type { Auction } from '../interfaces/Auction';
import { NANOSECONDS_PER_MILLISECOND } from './formatUtils';

export interface AuctionStats {
    totalAuctions: number;
    totalSize: number;
    averagePrice: number | null;
    averageSize: number;

    bidCount: number;
    offerCount: number;
    bidSize: number;
    offerSize: number;

    corporateCount: number;
    municipalCount: number;
    corporateSize: number;
    municipalSize: number;

    upcomingCount: number;
    activeCount: number;
    concludedCount: number;
    expiredCount: number;
}

export function getAuctionStats(
    auctions: Auction[],
    currentTime: number
): AuctionStats {
    let totalSize = 0;
    let totalPrice = 0;
    let pricedAuctionCount = 0;

    let bidCount = 0;
    let offerCount = 0;
    let bidSize = 0;
    let offerSize = 0;

    let corporateCount = 0;
    let municipalCount = 0;
    let corporateSize = 0;
    let municipalSize = 0;

    let upcomingCount = 0;
    let activeCount = 0;
    let concludedCount = 0;
    let expiredCount = 0;

    auctions.forEach((auction) => {
        totalSize += auction.size;

        if (auction.price !== null) {
            totalPrice += auction.price;
            pricedAuctionCount += 1;
        }

        if (auction.side === 'Bid') {
            bidCount += 1;
            bidSize += auction.size;
        }

        if (auction.side === 'Offer') {
            offerCount += 1;
            offerSize += auction.size;
        }

        if (auction.productType === 'Corporate') {
            corporateCount += 1;
            corporateSize += auction.size;
        }

        if (auction.productType === 'Municipal') {
            municipalCount += 1;
            municipalSize += auction.size;
        }

        const curtain =
            auction.curtainTimestamp /
            NANOSECONDS_PER_MILLISECOND;

        const expiration =
            auction.expirationTimestamp /
            NANOSECONDS_PER_MILLISECOND;

        const conclusion =
            auction.conclusionTimestamp !== null
                ? auction.conclusionTimestamp /
                    NANOSECONDS_PER_MILLISECOND
                : null;

        if (
            conclusion !== null &&
            conclusion <= currentTime
        ) {
            concludedCount += 1;
        } else if (expiration <= currentTime) {
            expiredCount += 1;
        } else if (curtain > currentTime) {
            upcomingCount += 1;
        } else {
            activeCount += 1;
        }
    });

    const totalAuctions = auctions.length;

    return {
        totalAuctions,
        totalSize,
        averagePrice:
            pricedAuctionCount > 0
                ? totalPrice / pricedAuctionCount
                : null,
        averageSize:
            totalAuctions > 0
                ? totalSize / totalAuctions
                : 0,

        bidCount,
        offerCount,
        bidSize,
        offerSize,

        corporateCount,
        municipalCount,
        corporateSize,
        municipalSize,

        upcomingCount,
        activeCount,
        concludedCount,
        expiredCount
    };
}