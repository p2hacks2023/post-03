import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes/index.tsx'
import AuthStateProvider from './features/auth/AuthStateProvider.tsx'
import { Toaster } from 'react-hot-toast'
import startFutokoroService from './features/futokoro/service.ts'
import FutokoroServiceProvider from './features/futokoro/FutokoroServiceProvider.tsx'
import startPrepaidCardService from './features/prepaid/local.ts'
import "normalize.css";
import "./index.css";

(window as any).bosom = () => {
  console.log("Application start!");

  startPrepaidCardService();
  startFutokoroService();

  const router = createBrowserRouter(routes);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthStateProvider>
        <FutokoroServiceProvider>
          <RouterProvider router={router} />
        </FutokoroServiceProvider>
      </AuthStateProvider>
      <Toaster />
    </React.StrictMode>,
  )
}

document.addEventListener("deviceready", () => {
  (window as any).bosom();
});