// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const isRelease = true; //import.meta.env.MODE === "production";

export const API_URL = isRelease
  ? "https://card-service.zkid.app"
  : "https://card-service.zkid.xyz";
// export const API_URL = isRelease ? 'https://card-service.zkid.app' : 'http://192.168.3.11:6007';
export const WS_URL = isRelease
  ? "wss://wss.card-service.zkid.app/card/ws"
  : "wss://wss.card-service.zkid.xyz/card/ws";

export const DID_SERVICE = isRelease
  ? "https://did-service.zkid.app"
  : "https://did-service.zkid.xyz";
export const VALID_SERVICE = isRelease
  ? "https://valid3-service.valid3.id"
  : "https://valid3-service.zkid.xyz";
