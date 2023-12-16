import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "./routes/index.tsx";
import { Toaster } from "react-hot-toast";
import startFutokoroService from "./features/futokoro/service.ts";
import FutokoroServiceProvider from "./features/futokoro/FutokoroServiceProvider.tsx";
import startPrepaidCardService from "./features/prepaid/local.ts";
import CustomToast from "./features/ui/Toast.tsx";
import "normalize.css";
import "./index.css";

(window as any).bosom = () => {
  console.log("Application start!");

  startPrepaidCardService();
  startFutokoroService();

  const router = createMemoryRouter(routes);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <FutokoroServiceProvider>
        <RouterProvider router={router} />
      </FutokoroServiceProvider>
      <Toaster>
        {
          toast => <CustomToast toast={toast} />
        }
      </Toaster>
    </React.StrictMode>,
  );
};

document.addEventListener("deviceready", () => {
  (window as any).bosom();
});
