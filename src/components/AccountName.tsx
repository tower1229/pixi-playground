// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useVid } from "@/hooks";
import React, { useMemo } from "react";

import { isDidUrl } from "@zcloak/did";
import { parseDid } from "@zcloak/did-resolver/parseDid";

import Address from "./Address";

interface Props {
  value?: string | undefined | null;
  showFull?: boolean;
}

function AccountName({ showFull, value }: Props) {
  const { vid } = useVid(isDidUrl(value) ? value : null);
  const [prefix, content] = useMemo(() => {
    if (isDidUrl(value)) {
      return ["did:zk:", parseDid(value).identifier];
    } else {
      return [null, value || ""];
    }
  }, [value]);

  return (
    <>
      {vid || (
        <>
          {prefix}
          <Address showFull={showFull} value={content} />
        </>
      )}
    </>
  );
}

export default React.memo(AccountName);
