import { API_URL, VALID_SERVICE } from "@/config";
import { fetcher } from "./fetcher";
import { buildQueryString } from "./util";
import { DidDocumentWithProof, DidUrl } from "@zcloak/did-resolver/types";
import { ChainCodeType } from "./login";

const jsonHeader = { "Content-Type": "application/json" };

export const getVid = async (did: string): Promise<string | null> => {
  const res = await fetcher(`${VALID_SERVICE}/api/valid_name/resolve`, {
    method: "POST",
    mode: "cors",
    headers: jsonHeader,
    body: JSON.stringify({ did }),
  });

  if (res?.code !== 200) {
    throw new Error(res?.msg);
  } else {
    return res.data;
  }
};

export function getBind(onChainAddress?: string | null, chainCode = "eth") {
  const query = buildQueryString({ onChainAddress, chainCode });

  return fetcher(`${API_URL}/api/account/did/list?${query}`, {
    method: "GET",
    headers: jsonHeader,
  });
}

export function getKycBind(ethAddress?: string | null) {
  const query = buildQueryString({ ethAddress });

  return fetcher(`${API_URL}/api/kyc/address/bind?${query}`, {
    method: "GET",
    headers: jsonHeader,
  });
}

export async function submitDocument(didDocument: DidDocumentWithProof) {
  const res = await fetcher(`${API_URL}/api/did`, {
    method: "POST",
    mode: "cors",
    headers: jsonHeader,
    body: JSON.stringify({ didDocument }),
  });

  if (res?.code !== 200) {
    throw new Error(res?.msg);
  } else {
    return res.data;
  }
}

export async function bindEthDid(params: {
  chainCode: ChainCodeType;
  onChainAddress: string;
  didUrl: string;
  timestamp: number;
  walletSignature: string;
  didSignature: string;
}) {
  const res = await fetcher(`${API_URL}/api/account/did/bind`, {
    method: "POST",
    mode: "cors",
    headers: jsonHeader,
    body: JSON.stringify(params),
  });

  if (res?.code !== 200) {
    throw new Error(res?.msg);
  } else {
    return res.data;
  }
}

export async function siweRequest(did: DidUrl): Promise<{ message: string }> {
  const res = await fetcher(`${API_URL}/api/login/siwe/message/generate`, {
    method: "POST",
    mode: "cors",
    headers: jsonHeader,
    body: JSON.stringify({ did }),
  });

  if (res?.code !== 200) {
    throw new Error(res?.msg);
  } else {
    return res.data;
  }
}

export async function verifySig(
  did: DidUrl,
  signature: string
): Promise<string> {
  const res = await fetcher(`${API_URL}/api/login/siwe/signature/verify`, {
    method: "POST",
    mode: "cors",
    headers: jsonHeader,
    body: JSON.stringify({ did, signature }),
  });

  if (res?.code !== 200) {
    throw new Error(res?.msg);
  } else {
    return res.data;
  }
}
