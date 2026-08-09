import { useCallback, useEffect, useState } from 'react';

import type { Auction } from '../interfaces/Auction';
import type { AuctionQuery } from '../interfaces/AuctionQuery';
import { getAuctions } from '../services/auctionService';

export function useAuctions(query: AuctionQuery) {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [resolvedQuery, setResolvedQuery] =
        useState<AuctionQuery | null>(null);
    const [requestVersion, setRequestVersion] = useState(0);

    const isLoading = resolvedQuery !== query;

    const refetch = useCallback(() => {
        setResolvedQuery(null);
        setRequestVersion((current) => current + 1);
    }, []);

    useEffect(() => {
        let ignore = false;

        const fetchAuctions = async () => {
            try {
                const response = await getAuctions(query);

                if (ignore) {
                    return;
                }

                setAuctions(response.data);
                setError(null);
            } catch (error) {
                if (ignore) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load auctions'
                );
            } finally {
                if (!ignore) {
                    setResolvedQuery(query);
                }
            }
        };

        fetchAuctions();

        return () => {
            ignore = true;
        };
    }, [query, requestVersion]);

    return {
        auctions,
        isLoading,
        error,
        refetch
    };
}