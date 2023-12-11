// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { LOGIN_KEY, TOKEN_PREFIX } from "@/config/token";
import { siweRequest, verifySig } from "@/utils/api";
import { store } from "@/utils/store";
import { stringToHex, toHex } from "viem";

import { Did } from "@zcloak/did";
import { LoginDid } from "@zcloak/login-did";
import { adaptZkidWallet } from "@zcloak/login-providers";

import { AuthToken } from "./AuthToken";
import { LoginType, LoginWalletType } from "./types";

export const siweLogin = async (type: LoginWalletType, did?: Did | null) => {
  if (!did) return;
  const { message } = await siweRequest(did.id);

  const { signature } = await did.signWithKey(
    stringToHex(message),
    "controller"
  );

  const token = await verifySig(did.id, toHex(signature));

  const authToken = new AuthToken(token, type);
  const loginType: LoginType = { type, didUrl: did.id };

  await store.set(`${TOKEN_PREFIX}${did?.id}`, authToken.toString());
  await store.set(LOGIN_KEY, loginType);
};

export const zkLogin = async (force = false) => {
  const provider = adaptZkidWallet();

  const isAuth = await provider.isAuth();

  const did =
    isAuth || force ? await LoginDid.fromProvider(provider) : undefined;

  return { provider, did };
};
