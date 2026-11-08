import type { ProductType, Side } from "../types/AuctionTypes";

export interface Auction {
    cusip: string;
    id: number;
    side: Side;
    size: number;
    curtainTimestamp: number;
    expirationTimestamp: number;
    conclusionTimestamp: number | null;
    price: number | null;
    productType: ProductType;
}