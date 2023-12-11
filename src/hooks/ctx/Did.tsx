// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidState } from './types';

import { createContext, useEffect, useState } from 'react';

import { Did } from '@zcloak/did';
import { LoginDid } from '@zcloak/login-did';
import { adaptZkidWallet } from '@zcloak/login-providers';
import { ZkidWalletProvider } from '@zcloak/login-providers/types';

export const DidCtx = createContext<DidState>({} as unknown as DidState);

export function DidRoot({ children }: { initialDid?: Did; children: React.ReactNode }) {
  const [did, setDid] = useState<Did | undefined | null>();
  const [provider, setProvider] = useState<ZkidWalletProvider>(adaptZkidWallet());

  useEffect(() => {
    const didChanged = () => {
      LoginDid.fromProvider(provider).then(setDid);
    };

    provider.addListener('did_changed', didChanged);

    return () => {
      provider.removeListener('did_changed', didChanged);
    };
  }, [provider]);

  return (
    <DidCtx.Provider value={{ did, provider, isConnected: !!did, setDid, setProvider }}>{children}</DidCtx.Provider>
  );
}
