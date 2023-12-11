// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Did } from "@zcloak/did";

import { TOKEN_PREFIX } from "@/config/token";

import { LoginDid } from "@zcloak/login-did";
import { adaptZkidWallet, ExtensionProvider } from "@zcloak/login-providers";

import { store } from "./store";

export async function initDid(): Promise<Did | undefined> {
  const provider = adaptZkidWallet();

  if (
    provider instanceof ExtensionProvider &&
    !(await ExtensionProvider.isInstalled())
  ) {
    return undefined;
  }

  const isAuth = await provider.isAuth();

  const did = isAuth ? await LoginDid.fromProvider(provider) : undefined;

  const isLogin = await store.get(`${TOKEN_PREFIX}${did?.id}`);

  return isLogin ? did : undefined;
}
