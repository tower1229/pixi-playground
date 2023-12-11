// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from "react";
import { session, store } from "@/utils/store";

import { DidAccount, DidAccounts, WalletKeyring } from "@zcloak/wallet-lib";

import { useQueryBind } from "./useQueryBind";

export function useDidAccounts(ethAddress?: string | null | undefined) {
  const didAccountsRef = useRef<DidAccounts | null>(null);
  const [keyring, setKeyring] = useState<WalletKeyring | null>(null);
  const [did, setDid] = useState<DidAccount | null>(null);
  const [isBind, mutateBind] = useQueryBind(
    ethAddress,
    didAccountsRef.current?.current?.instance.id
  );

  const mutate = useCallback(() => {
    if (ethAddress) {
      const _keyring = new WalletKeyring(store, session, ethAddress);
      const _didAccounts = new DidAccounts(
        ethAddress,
        _keyring,
        store,
        session
      );

      _didAccounts.isReady.then((_d) => {
        didAccountsRef.current = _d;
        setKeyring(_keyring);
        setDid(_d.current);
      });
    } else {
      didAccountsRef.current = null;
    }
  }, [ethAddress]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return {
    did: did || didAccountsRef.current?.current,
    isLocked: !keyring?.password,
    keyring,
    didAccounts: didAccountsRef.current,
    accounts: didAccountsRef.current?.accounts,
    isBind,
    mutateBind,
  };
}
