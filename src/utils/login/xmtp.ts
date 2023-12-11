// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PHASE_KEY } from "@/config/token";
import { AccountBind } from "@/hooks/useQueryBind";
import { api } from "@/utils";
import { store } from "@/utils/store";
import { Hex } from "viem";
import { bytesToHex, isHex, stringToHex } from "viem/utils";

import { Did } from "@zcloak/did";
import { DidAccount, DidAccounts, utils } from "@zcloak/wallet-lib";

import { ChainCodeType } from "./types";

export function requestPhaseText(phase: Uint8Array | Hex) {
  const bytesHex = isHex(phase) ? phase : bytesToHex(phase);

  return `zkID: Enable W3C DID\n${bytesHex}\n\nMore information: https://github.com/zCloak-Network/zk-did-method-specs`;
}

export function generateBindText(
  chainCode: ChainCodeType,
  didUrl: string,
  onChainAddress: string,
  time: number
) {
  return `${chainCode}--${onChainAddress}--${didUrl}--${time}`;
}

export async function generateDid(
  didAccounts?: DidAccounts | null,
  address?: string,
  signMessageAsync?: (args?: any) => Promise<`0x${string}`>
): Promise<DidAccount> {
  if (!didAccounts || !address || !signMessageAsync) {
    throw new Error("Invalid wallet arguments.");
  }

  const wPreKey = crypto.getRandomValues(new Uint8Array(32));
  const message = requestPhaseText(wPreKey);
  const sig = await signMessageAsync({ message });

  const mnemonic = utils.mnemonic.mnemonicGenerate(12);

  const did = await didAccounts.generate(mnemonic, sig);

  didAccounts.setCurrent(did.instance.id);

  await store.set(`${address}${PHASE_KEY}`, bytesToHex(wPreKey));

  return did;
}

export async function generate(
  didAccounts?: DidAccounts | null,
  password?: string | null
  // signMessageAsync?: (args?: any) => Promise<`0x${string}`>
): Promise<DidAccount> {
  if (!didAccounts || !password) {
    throw new Error("Invalid wallet arguments.");
  }

  // const wPreKey = crypto.getRandomValues(new Uint8Array(32));
  // const message = requestPhaseText(wPreKey);
  // const sig = await signMessageAsync({ message });

  const mnemonic = utils.mnemonic.mnemonicGenerate(12);

  const did = await didAccounts.generate(mnemonic, password);

  didAccounts.setCurrent(did.instance.id);

  // await store.set(`${address}${PHASE_KEY}`, bytesToHex(wPreKey));

  return did;
}

export async function bindWalletWithDid(
  did: Did,
  address: string,
  signMessageAsync: (args?: any) => Promise<`0x${string}`>
): Promise<AccountBind> {
  const bindTime = Date.now();

  const message = generateBindText("eth", did.id, address, bindTime);
  const didSig = await did.signWithKey(stringToHex(message), "controller");
  const ethSignature = await signMessageAsync({ message });

  const result = await api.bindEthDid({
    didUrl: did.id,
    onChainAddress: address,
    chainCode: "eth",
    walletSignature: ethSignature,
    didSignature: bytesToHex(didSig.signature),
    timestamp: bindTime,
  });

  return result;
}

export async function isCreateMnemonic(ethAddress: string) {
  const mn = await store.get(`${ethAddress}app_mnemonic`);

  return !!mn;
}
