// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import useSWR from "swr";
import { api, ChainCodeType } from "@/utils";
import { buildQueryString } from "@/utils/util";

import { API_URL } from "@/config";

export interface AccountBind {
  // eth
  chainCode: ChainCodeType;
  onChainAddress: string;
  didUrl: string;

  createdTime: number;
  modifyTime: number;
}

export async function isBindDid(
  onChainAddress?: string | null,
  didUrl?: string | null,
  chainCode = "eth"
) {
  const res = await api.getBind(onChainAddress, chainCode);

  if (res?.data) {
    return (
      (res.data as AccountBind[]).filter((a) => {
        return didUrl ? a.didUrl === didUrl : true;
      }).length > 0
    );
  } else {
    return false;
  }
}

export async function isKycBind(onChainAddress?: string | null) {
  const res = await api.getKycBind(onChainAddress);

  return !!res?.data;
}

export function useQueryBind(
  onChainAddress?: string | null,
  didUrl?: string | null,
  chainCode = "eth"
): [boolean, () => void] {
  const [isBind, setIsBind] = useState(false);

  const query = buildQueryString({ onChainAddress, chainCode });

  const { data, mutate } = useSWR(
    onChainAddress ? `${API_URL}/api/account/did/list?${query}` : null
  );

  useEffect(() => {
    if (data?.data) {
      (data.data as AccountBind[])?.forEach((item) => {
        if (item.didUrl === didUrl && item.onChainAddress === onChainAddress) {
          setIsBind(true);
        }
      });
    } else {
      setIsBind(false);
    }
  }, [data, onChainAddress, didUrl]);

  return [isBind, mutate];
}
