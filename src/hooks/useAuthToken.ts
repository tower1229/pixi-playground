// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { LOGIN_KEY, TOKEN_PREFIX } from "@/config/token";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthToken, events, LoginType, zkLogin } from "@/utils";
import { store } from "@/utils/store";
import { useAccount, useDisconnect } from "wagmi";

import { LoginDid } from "@zcloak/login-did";

import { BrowserDidCtx, DidCtx } from "./ctx";

export function useAuthToken() {
  const [token, setToken] = useState<AuthToken | null>(null);
  const { did, setDid, setProvider } = useContext(DidCtx);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { did: current } = useContext(BrowserDidCtx);

  const eagerLogin = useCallback(async () => {
    const data = await store.get(LOGIN_KEY);

    if (!data) return;

    const { type } = data as LoginType;

    if (type === "zkid-browser" && current) {
      setDid(current.instance);
    }

    if (type === "zkid-wallet") {
      await zkLogin(true).then(({ did, provider }) => {
        setDid(did);
        setProvider(provider);
      });
    }
  }, [current, setDid, setProvider]);

  const logout = useCallback(async () => {
    if (did) {
      await store.remove(`${TOKEN_PREFIX}${did?.id}`);
      await store.remove(LOGIN_KEY);
      setDid(null);
    }

    if (!(did instanceof LoginDid)) {
      disconnect();
    }
  }, [did, setDid, disconnect]);

  useEffect(() => {
    if (did) return;

    eagerLogin();
  }, [eagerLogin, did]);

  useEffect(() => {
    if (!did) return;

    store
      .get(`${TOKEN_PREFIX}${did?.id}`)
      .then((token: unknown) => {
        setToken(AuthToken.parse(token));
      })
      .then(() =>
        store.set(LOGIN_KEY, {
          type: did instanceof LoginDid ? "zkid-wallet" : "zkid-browser",
          didUrl: did.id,
        } as LoginType)
      );
  }, [did]);

  useEffect(() => {
    if (did instanceof LoginDid) return;

    if (address && current) {
      setDid(current.instance);
    } else {
      setDid(null);
      setToken(null);
      store.remove(LOGIN_KEY);
    }
  }, [address, setDid, did, current]);

  useEffect(() => {
    const storeChanged = (key: string, _: any, newVal: any) => {
      if (key === `${TOKEN_PREFIX}${did?.id}`) {
        if (newVal) {
          setToken(AuthToken.parse(newVal));
        } else {
          setToken(null);
        }
      }
    };

    store.on("store_changed", storeChanged);

    return () => {
      store.off("store_changed", storeChanged);
    };
  }, [did]);

  useEffect(() => {
    events.on("unauthorized", logout);

    return () => {
      events.off("unauthorized", logout);
    };
  }, [logout]);

  return { token, logout };
}
