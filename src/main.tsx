import ReactDOM from "react-dom/client";
import "./assets/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import rootRoute from "./pages";
import { initCrypto } from "@zcloak/crypto";
import { utils } from "@zcloak/wallet-lib";
import { DidRoot, WagmiRoot } from "./hooks";
import AuthProvider from "./hooks/ctx/Auth";
import BrowserDidRoot from "./hooks/ctx/BrowserDid";
import ToastRoot from "./hooks/ctx/ToastRoot";

const router = createBrowserRouter(rootRoute, {
  basename: import.meta.env.BASE_URL,
});

utils
  .initCrypto()
  .then(() => initCrypto())
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <WagmiRoot>
        <DidRoot>
          <BrowserDidRoot>
            <AuthProvider>
              <ToastRoot />
              <RouterProvider router={router} />
            </AuthProvider>
          </BrowserDidRoot>
        </DidRoot>
      </WagmiRoot>
    );
  });
