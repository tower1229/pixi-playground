// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JoyIdConnector } from "@joyid/wagmi";
import { walletConnectProvider } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import { optimismGoerli } from "viem/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";

const projectId = "9b4a033ddb52a00e24afe26be68e50cb";

const metadata = {
  name: "ZK Maze",
  description: "Own Your Digital Life with Web3 Cards.",
  url: "https://card.zkid.app",
  icons: ["https://card.zkid.app/favicon.ico"],
};

const { chains, publicClient } = configureChains(
  [optimismGoerli],
  [walletConnectProvider({ projectId }), publicProvider()]
);

const metamaskConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: true,
  },
});

const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: { appName: metadata.name },
});

export const joyidConnector = new JoyIdConnector({
  chains,
  options: {
    // name of your app
    name: "ZK Maze",
    // logo of your app
    logo: "https://card.zkid.app/favicon.ico",
    // JoyID app url that your app is integrated with
    joyidAppURL: "https://app.joy.id/",
  },
});

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: { projectId, showQrModal: false, metadata },
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [walletConnectConnector, metamaskConnector, coinbaseConnector],
  publicClient,
});

// const config = createConfig({
//   autoConnect: true,
//   connectors: [walletConnectConnector, metamaskConnector],
//   publicClient
// });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: "light" });

export function WagmiRoot({ children }: { children: React.ReactNode }) {
  wagmiConfig.connectors.push(joyidConnector);

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
