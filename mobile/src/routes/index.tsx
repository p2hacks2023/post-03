import { RouteObject } from "react-router-dom";
import Layout from "./Layout";
import DashboardPage from "../pages/DashboardPage";
import ConfigPage from "../pages/ConfigPage";

const routes = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/config",
        element: <ConfigPage />,
      },
    ],
  },
] satisfies RouteObject[];

export default routes;
