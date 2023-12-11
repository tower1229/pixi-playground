// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@zcloak/crypto/types';
import { DidKeys$Json } from '@zcloak/did/keys/types';

export type LoginWalletType = 'zkid-wallet' | 'zkid-browser';

export type ChainCodeType = 'eth';

export type LoginType = {
  type: LoginWalletType;
  didUrl: string;
};

export type DidKeysFileType = {
  keys: DidKeys$Json;
  originPhase: HexString;
};
