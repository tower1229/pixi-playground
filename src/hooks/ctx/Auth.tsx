// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAuthToken } from "@/hooks/useAuthToken";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AuthToken, zkLogin } from "@/utils";

import { Did } from "@zcloak/did";

import { DidCtx } from "./Did";

interface Props {
  token?: AuthToken | null;
  isAuth: boolean;
}

export const AuthCtx = createContext({} as Props);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthToken();
  const isAuth = useMemo(() => Boolean(token?.token), [token]);
  const { did, provider, setDid } = useContext(DidCtx);

  useEffect(() => {
    if (did instanceof Did) return;

    const eagerZkLogin = async () => {
      const { did: loginDid } = await zkLogin(true);

      setDid(loginDid);
    };

    provider.on("did_changed", eagerZkLogin);

    return () => {
      provider.off("did_changed", eagerZkLogin);
    };
  }, [provider, setDid, did]);

  return (
    <AuthCtx.Provider value={{ token, isAuth }}>{children}</AuthCtx.Provider>
  );
};

export default AuthProvider;
