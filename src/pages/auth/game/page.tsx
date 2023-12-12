import { Hero } from "./_components/Hero";
import { Game } from "./_components/Game";

import { useAccount } from "wagmi";

export default function GamePage() {
  const { isDisconnected } = useAccount();

  return isDisconnected ? <Game /> : <Hero />;
}
