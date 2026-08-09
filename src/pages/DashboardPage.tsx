import AuctionGrid from "../components/AuctionGrid";
import { useAuctions } from "../hooks/useAuctions";

export default function Dashboard() {
  const { auctions } = useAuctions();

  return (
    <main>
      <h1>Auction Dashboard</h1>

      <AuctionGrid auctions={auctions} />
    </main>
  );
}