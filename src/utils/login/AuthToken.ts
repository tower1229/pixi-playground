// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { LoginWalletType } from './types';

export class AuthToken {
  #token: string;
  #loginWalletType: LoginWalletType;

  constructor(token: string, walletType: LoginWalletType) {
    this.#token = token;
    this.#loginWalletType = walletType;
  }

  get token() {
    return this.#token;
  }

  get loginWalletType() {
    return this.#loginWalletType;
  }

  public toString() {
    return JSON.stringify({ token: this.token, loginWalletType: this.loginWalletType });
  }

  static parse(value: unknown): AuthToken | null {
    if (value) {
      const { loginWalletType, token } = JSON.parse(value as string);

      return new AuthToken(token, loginWalletType);
    } else {
      return null;
    }
  }
}
