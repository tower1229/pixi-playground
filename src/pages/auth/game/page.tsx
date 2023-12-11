import { Hero } from "./_components/hero";
import { Game } from "./_components/game";

import { AuthCtx } from "@/hooks/ctx/Auth";
import { useContext } from "react";

export default function GamePage() {
  const { isAuth } = useContext(AuthCtx);

  return isAuth ? <Game /> : <Hero />;
}
