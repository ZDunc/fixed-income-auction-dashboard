import { useEffect, useState } from 'react';

import type { Auction } from '../interfaces/Auction';
import { getAuctions } from '../services/auctionService';

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const response = await getAuctions({});
      setAuctions(response.data);
    };

    fetchAuctions();
  }, []);

  return { auctions };
}