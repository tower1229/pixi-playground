import Layout from "@/pages/layouts/Layout";

import NoFound from "./no-found/page";
import authRoutes from "./auth";

const rootRouter = [
  {
    path: "/",
    element: <Layout />,
    children: [...authRoutes],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];

export default rootRouter;
