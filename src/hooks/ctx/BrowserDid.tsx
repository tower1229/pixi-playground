// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useDidAccounts } from "@/hooks";
import { useUnlock } from "@/hooks/useUnlock";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { api, resolver } from "@/utils";
import { useAccount } from "wagmi";

import { DidUrl } from "@zcloak/did-resolver/types";
import { DidAccount } from "@zcloak/wallet-lib";

import { BrowserDidState } from "./types";

export const BrowserDidCtx = createContext({} as BrowserDidState);

const BrowserDidRoot: React.FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();
  const { didAccounts, isBind, isLocked, keyring } = useDidAccounts(address);
  const [current, setCurrent] = useState<DidAccount | null | undefined>(
    didAccounts?.current
  );
  const [accounts, setAccounts] = useState<DidAccount[] | null | undefined>(
    didAccounts?.accounts
  );
  const [unlock] = useUnlock();

  useEffect(() => {
    const remove = (id: DidUrl) => {
      setAccounts(accounts?.filter((account) => account.instance.id !== id));
    };

    const add = () => {
      if (didAccounts) setAccounts([...didAccounts.accounts]);
    };

    const currentChange = (current: DidAccount) => {
      setCurrent(current);
    };

    didAccounts?.on("current_changed", currentChange);
    didAccounts?.on("remove", remove);
    didAccounts?.on("add", add);

    return () => {
      didAccounts?.off("current_changed", currentChange);

      didAccounts?.off("remove", remove);
      didAccounts?.off("add", add);
    };
  }, [didAccounts, accounts]);

  useEffect(() => {
    didAccounts?.isReady.then((d) => {
      setCurrent(d.current);
      setAccounts(d.accounts);
    });
  }, [didAccounts]);

  useEffect(() => {
    if (!current) return;

    resolver.resolve(current.instance.id).catch(() => {
      unlock(didAccounts).then(() => {
        current.instance
          .getPublish()
          .then((document) => api.submitDocument(document));
      });
    });
  }, [current, didAccounts, unlock]);

  return (
    <BrowserDidCtx.Provider
      value={{
        accounts,
        isLocked,
        didAccounts,
        isBind,
        keyring,
        did: current,
      }}
    >
      {children}
    </BrowserDidCtx.Provider>
  );
};

export default BrowserDidRoot;
