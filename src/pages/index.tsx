import Layout from "@/pages/layouts/Layout";

import NoFound from "./no-found/page";
import Game from "./game/page";

const rootRouter = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <Game />,
        index: true,
      },
    ],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];

export default rootRouter;
