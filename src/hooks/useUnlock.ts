// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PHASE_KEY } from "@/config/token";
import { useCallback, useContext, useMemo } from "react";
import { requestPhaseText } from "@/utils";
import { store } from "@/utils/store";
import { isHex, verifyMessage } from "viem";
import { useAccount, useSignMessage } from "wagmi";

import { DidAccounts } from "@zcloak/wallet-lib";

import { BrowserDidCtx } from "./ctx";

export function useUnlock() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { didAccounts } = useContext(BrowserDidCtx);

  const unlock = useCallback(
    async (_d?: DidAccounts | null) => {
      const _didAccounts = _d || didAccounts;

      if (!_didAccounts || !address) return;

      if (_didAccounts.isLocked) {
        const phase = await store.get(`${address}${PHASE_KEY}`);

        if (isHex(phase)) {
          const message = requestPhaseText(phase);
          const signature = await signMessageAsync({ message });

          const isValid = await verifyMessage({ address, message, signature });

          if (!isValid) {
            throw new Error("Invalid signature.");
          }

          await _didAccounts.unlock(signature);
        }
      }
    },
    [signMessageAsync, address, didAccounts]
  );

  return useMemo(() => [unlock], [unlock]);
}
