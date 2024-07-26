import Layout from "@/pages/layouts/Layout";

import NoFound from "./no-found/page";
import Game from "./game/page";
import FishPond from "./fish-pond/page";

const rootRouter = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "game",
        element: <Game />,
      },
      {
        path: "fish-pond",
        element: <FishPond />,
      },
    ],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];

export default rootRouter;
