import { useEffect, useState } from 'react';

import type { Auction } from '../interfaces/Auction';
import type { AuctionQuery } from '../interfaces/AuctionQuery';
import { getAuctions } from '../services/auctionService';

export function useAuctions(query: AuctionQuery) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resolvedQuery, setResolvedQuery] =
    useState<AuctionQuery | null>(null);

  const isLoading = resolvedQuery !== query;

  useEffect(() => {
    let cancelled = false;

    const fetchAuctions = async () => {
      try {
        const response = await getAuctions(query);

        if (cancelled) {
          return;
        }

        setAuctions(response.data);
        setError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load auctions',
        );
      } finally {
        if (!cancelled) {
          setResolvedQuery(query);
        }
      }
    };

    fetchAuctions();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return {
    auctions,
    isLoading,
    error,
  };
}