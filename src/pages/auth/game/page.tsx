import { Hero } from "./_components/Hero";
import { Game } from "./_components/Game";

import { useAccount } from "wagmi";

export default function GamePage() {
  const { isConnected } = useAccount();
  return isConnected ? <Game /> : <Hero />;
}
