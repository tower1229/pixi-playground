// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import useSWR from "swr";
import { api } from "@/utils";

import { DidUrl } from "@zcloak/did-resolver/types";

export function useVid(did?: DidUrl | null) {
  const { data } = useSWR<string | null>(did ? [did] : [], ([did]) =>
    api.getVid(did)
  );

  return { vid: data };
}
