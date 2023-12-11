// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArweaveDidResolver } from "@zcloak/did-resolver";

import { DID_SERVICE } from "@/config/constants";

export const resolver = new ArweaveDidResolver({ server: DID_SERVICE });
