import type { ProductType, Side, SortType } from "../types/AuctionTypes";

export interface AuctionQuery {
    cusips?: string[];
    id?: number;
    sides?: Side[];
    sizeMin?: number;
    sizeMax?: number;
    priceMin?: number;
    priceMax?: number;
    productTypes?: ProductType[];
    page?: number;
    pageSize?: number;
    sortColumn?: string;
    sortType?: SortType;
}