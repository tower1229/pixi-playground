// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Did } from '@zcloak/did';

// import type { BaseProvider } from '@zcloak/login-providers/base/Provider';
import { ZkidWalletProvider } from '@zcloak/login-providers/types';
import { DidAccount, DidAccounts, WalletKeyring } from '@zcloak/wallet-lib';

export interface DidState {
  did: Did | undefined | null;
  provider: ZkidWalletProvider;
  isConnected: boolean;
  // isConnecting: boolean;
  // connect: () => void;
  setDid: (did?: Did | null) => void;
  setProvider: (provider: ZkidWalletProvider) => void;
}

export interface SyncState {
  isSyncing: boolean;
  isConnected: boolean;
  syncError?: Error;
}

export interface BrowserDidState {
  accounts?: DidAccount[] | null;
  didAccounts?: DidAccounts | null;
  keyring: WalletKeyring | null;
  isLocked: boolean;
  isBind: boolean;
  did?: DidAccount | null;

  // openBind: boolean;
  // onWcConnect: () => Promise<void>;
  // onZkidWalletConnect: () => void;
  // zkidLoading: boolean;
  // wcLoading: boolean;

  // openConnect: boolean;
  // setOpenConnect: (open: boolean) => void;
  // reset: () => void;

  // setOpenBind: (open: boolean) => void;
  // // bindLoading: boolean;
  // openRestore: boolean;
  // setOpenRestore: (open: boolean) => void;
}
