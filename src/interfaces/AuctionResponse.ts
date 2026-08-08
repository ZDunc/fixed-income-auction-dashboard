import type { Auction } from './Auction';
import type { PaginationInfo } from './PaginationInfo';

export interface AuctionResponse {
    data: Auction[];
    paginationInfo?: PaginationInfo;
}