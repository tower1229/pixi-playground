// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCreate } from "@/hooks";
import React from "react";

import BoundRestore from "./WebWallet/BoundRestore";
import Connect from "./Connect";
import ZkBind from "./ZkBind";

function ButtonEnable({ ...props }) {
  const {
    joyIdLoading,
    onJoyIdConnect,
    onWcConnect,
    onZkidWalletConnect,
    openBind,
    openConnect,
    openRestore,
    reset,
    setOpenBind,
    setOpenConnect,
    setOpenRestore,
    wcLoading,
    zkidLoading,
  } = useCreate();

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setOpenConnect(true)}
        {...props}
      >
        Connect Wallet to Play
      </button>

      {openConnect && (
        <Connect
          joyIdLoading={joyIdLoading}
          onJoyIdConnect={onJoyIdConnect}
          onWcConnect={onWcConnect}
          onZkidWalletConnect={onZkidWalletConnect}
          openConnect={openConnect}
          setOpenConnect={setOpenConnect}
          wcLoading={wcLoading}
          zkidLoading={zkidLoading}
        />
      )}

      {openRestore && (
        <BoundRestore
          onClose={() => setOpenRestore(false)}
          open={openRestore}
          reset={reset}
          setOpenBind={setOpenBind}
        />
      )}

      {openBind && (
        <ZkBind
          onClose={() => setOpenBind(false)}
          open={openBind}
          reset={reset}
        />
      )}
    </>
  );
}

export default React.memo(ButtonEnable);
