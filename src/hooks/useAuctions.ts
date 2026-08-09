import { useEffect, useState } from 'react';

import type { Auction } from '../interfaces/Auction';
import { getAuctions } from '../services/auctionService';

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await getAuctions({});
        setAuctions(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load auctions',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return {
    auctions,
    isLoading,
    error,
  };
}