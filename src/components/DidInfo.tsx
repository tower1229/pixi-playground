import { DidCtx } from "@/hooks";
import { useContext } from "react";

import AccountName from "./AccountName";

const DidInfo = () => {
  const { did } = useContext(DidCtx);

  return (
    <div>
      <AccountName value={did?.id} />
    </div>
  );
};

export default DidInfo;
