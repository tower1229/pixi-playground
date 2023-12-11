import { UploadKeysfile } from "@/components";
import { PHASE_KEY } from "@/config/token";
import { BrowserDidCtx, DidCtx, useToggle } from "@/hooks";
import { isBindDid } from "@/hooks/useQueryBind";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  bindWalletWithDid,
  DidKeysFileType,
  generateDid,
  requestPhaseText,
  siweLogin,
} from "@/utils";
import { store } from "@/utils/store";
import { useAccount, useSignMessage } from "wagmi";
import { Dialog } from "@/components";

interface Props {
  open: boolean;
  onClose: () => void;
  reset: () => void;
  setOpenBind: (open: boolean) => void;
}

const BoundRestore: React.FC<Props> = ({
  onClose,
  open,
  reset,
  setOpenBind,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { didAccounts } = useContext(BrowserDidCtx);
  const [loadingNext, toggleNext] = useToggle();

  const { address } = useAccount();
  const [loading, toggle] = useToggle();
  const { setDid } = useContext(DidCtx);
  const { signMessageAsync } = useSignMessage();

  const restore = useCallback(async () => {
    if (!file || !didAccounts || !address) return;

    try {
      toggle();

      const text = await file.text();

      const { keys, originPhase } = JSON.parse(text) as DidKeysFileType;

      const message = requestPhaseText(originPhase);
      const signature = await signMessageAsync({ message });

      await didAccounts.unlock(signature);

      const account = await didAccounts?.importDidFile(keys, signature);

      const isBind = await isBindDid(address, account.instance.id);

      if (!isBind) {
        await bindWalletWithDid(account.instance, address, signMessageAsync);
      }

      didAccounts.setCurrent(account.instance.id);

      await store.set(`${address}${PHASE_KEY}`, originPhase);

      await siweLogin("zkid-browser", account.instance);

      setDid(account.instance);

      reset();

      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggle();
    }
  }, [
    didAccounts,
    file,
    onClose,
    toggle,
    setDid,
    reset,
    signMessageAsync,
    address,
  ]);

  const next = useCallback(async () => {
    try {
      toggleNext();
      await generateDid(didAccounts, address, signMessageAsync);

      setOpenBind(true);

      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggleNext();
    }
  }, [
    setOpenBind,
    didAccounts,
    signMessageAsync,
    onClose,
    address,
    toggleNext,
  ]);

  return (
    <>
      <Dialog open={open} onClose={onClose} title="zkID Account Restoration">
        <div className="my-4">
          It seems that your wallet has bound to a zkID Account in the past. If
          you wish to restore the account, upload your account Keysfile in the
          area below
        </div>
        <div className="my-4">
          Or you can simply create a new zkID Account and restore others later
          in My Accounts
        </div>
        <UploadKeysfile onChange={(files) => setFile(files?.[0])} />
        <button
          className="btn btn-block"
          disabled={file === null}
          onClick={restore}
        >
          {loading && <span className="loading loading-spinner"></span>}
          Restore Account
        </button>
        <button className="btn btn-block" onClick={next}>
          {loadingNext && <span className="loading loading-spinner"></span>}
          Create New zkID Account
        </button>
      </Dialog>
    </>
  );
};

export default BoundRestore;
