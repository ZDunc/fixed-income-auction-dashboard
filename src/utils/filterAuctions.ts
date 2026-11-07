import type { Auction } from '../interfaces/Auction';
import type { AuctionQuery } from '../interfaces/AuctionQuery';

export function filterAuctions(
    auctions: Auction[],
    query: AuctionQuery
): Auction[] {
    return auctions.filter(auction => {
        if (
            query.cusips?.length &&
            !query.cusips.some(
                cusip =>
                    cusip.toUpperCase() ===
                    auction.cusip.toUpperCase()
            )
        ) {
            return false;
        }

        if (
            query.id !== undefined &&
            auction.id !== query.id
        ) {
            return false;
        }

        if (
            query.sides?.length &&
            !query.sides.includes(auction.side)
        ) {
            return false;
        }

        if (
            query.productTypes?.length &&
            !query.productTypes.includes(auction.productType)
        ) {
            return false;
        }

        if (
            query.sizeMin !== undefined &&
            auction.size < query.sizeMin
        ) {
            return false;
        }

        if (
            query.sizeMax !== undefined &&
            auction.size > query.sizeMax
        ) {
            return false;
        }

        if (
            query.priceMin !== undefined &&
            (
                auction.price === null ||
                auction.price < query.priceMin
            )
        ) {
            return false;
        }

        if (
            query.priceMax !== undefined &&
            (
                auction.price === null ||
                auction.price > query.priceMax
            )
        ) {
            return false;
        }

        return true;
    });
}