import { PHASE_KEY } from "@/config/token";
import saveAs from "file-saver";
import { BrowserDidCtx, DidCtx, useToggle } from "@/hooks";
import { useUnlock } from "@/hooks/useUnlock";
import React, { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { bindWalletWithDid, siweLogin } from "@/utils";
import { store } from "@/utils/store";
import { useAccount, useSignMessage } from "wagmi";
import AccountName from "./AccountName";
import IcDownload from "@/assets/svg/ic_download.svg?react";
import { Dialog } from "@/components";

interface Props {
  open: boolean;
  onClose: () => void;
  reset: () => void;
}

const ZkBind: React.FC<Props> = ({ onClose, open, reset }) => {
  const { did, didAccounts } = useContext(BrowserDidCtx);
  const [loading, toggle] = useToggle();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [unlock] = useUnlock();
  const { setDid } = useContext(DidCtx);

  const exportDid = useCallback(async () => {
    if (!did) return;

    try {
      await unlock();

      const json = didAccounts?.exportDidFile(did.instance.id);

      const phase = await store.get(`${address}${PHASE_KEY}`);

      const blob = new Blob(
        [JSON.stringify({ keys: json, originPhase: phase })],
        {
          type: "text/plain;charset=utf-8",
        }
      );

      saveAs(blob, `${did.instance.id}.json`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [did, unlock, didAccounts, address]);

  const bindAndLogin = useCallback(async () => {
    if (!did || !address) return;

    try {
      toggle();

      await unlock(didAccounts);

      const result = await bindWalletWithDid(
        did.instance,
        address,
        signMessageAsync
      );

      if (
        result.didUrl === did.instance.id &&
        result.onChainAddress === address
      ) {
        await siweLogin("zkid-browser", did.instance);

        setDid(did.instance);

        reset();

        toast.success("Binding successful!");
      } else {
        throw new Error("Binding failed.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggle();
    }
  }, [
    unlock,
    did,
    address,
    setDid,
    signMessageAsync,
    toggle,
    reset,
    didAccounts,
  ]);

  return (
    <>
      {open && didAccounts && (
        <Dialog open={open} onClose={onClose} title="zkID Account Creation">
          <div className="flex items-center justify-between rounded bg-[#F2F4FA] border border-[#D9E0EC]">
            <div>Your DID will be:</div>
            <div>
              <AccountName value={did?.instance.id} />
            </div>
          </div>
          <div className="flex items-center mt-4 px-4 py-2 gap-2 rounded border border-[#ECECEE]">
            <div className="font-bold">Backup your seed phrase</div>
            <div className="text-center">
              Kindly ensure the secure storage of your seed phrase, as it will
              be necessary for account recovery. Additionally, refrain from
              sharing it with others, as it could grant unauthorized access to
              your digital assets.
            </div>
            <button className="btn btn-primary" onClick={exportDid}>
              <IcDownload />
              Download Keysfile
            </button>
          </div>
          <button className="btn btn-block" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-block" onClick={bindAndLogin}>
            {loading && <span className="loading loading-spinner"></span>}
            Create My Account
          </button>
        </Dialog>
      )}
    </>
  );
};

export default React.memo(ZkBind);
