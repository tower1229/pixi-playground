// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { LoadingButton, UploadKeysfile } from 'components';
import DialogHeader from 'components/common/DialogHeader';
import { BrowserDidCtx, DidCtx, useToggle } from 'hooks';
import { isBindDid } from 'hooks/useQueryBind';
import { useUnlock } from 'hooks/useUnlock';
import { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { bindWalletWithDid, DidKeysFileType, requestPhaseText, siweLogin } from 'utils';
import { useAccount, useSignMessage } from 'wagmi';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ImportDidKeysFile: React.FC<Props> = ({ onClose, open }) => {
  const [file, setFile] = useState<File | null>(null);
  const { didAccounts } = useContext(BrowserDidCtx);

  const { address } = useAccount();
  const [loading, toggle] = useToggle();
  const [unlock] = useUnlock();
  const { setDid } = useContext(DidCtx);
  const { signMessageAsync } = useSignMessage();

  const restore = useCallback(async () => {
    if (!file || !didAccounts || !address) return;

    try {
      toggle();

      await unlock();

      const text = await file.text();

      const { keys, originPhase } = JSON.parse(text) as DidKeysFileType;

      const message = requestPhaseText(originPhase);
      const signature = await signMessageAsync({ message });

      const account = await didAccounts?.importDidFile(keys, signature);

      const isBind = await isBindDid(address, account.instance.id);

      if (!isBind) {
        await bindWalletWithDid(account.instance, address, signMessageAsync);
      }

      didAccounts.setCurrent(account.instance.id);

      await siweLogin('zkid-browser', account.instance);

      setDid(account.instance);

      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggle();
    }
  }, [didAccounts, file, unlock, onClose, toggle, setDid, signMessageAsync, address]);

  return (
    <>
      <Dialog open={open}>
        <DialogHeader onClose={onClose} sx={{ textAlign: 'center' }}>
          zkID Account Restoration
        </DialogHeader>

        <DialogContent>
          <UploadKeysfile onChange={(files) => setFile(files?.[0])} />
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} size='large' variant='outlined'>
            Cancel
          </Button>
          <LoadingButton disabled={file === null} fullWidth loading={loading} onClick={restore} size='large'>
            Restore Account
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportDidKeysFile;
