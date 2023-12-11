// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import AccountName from 'components/AccountName';
import DialogHeader from 'components/common/DialogHeader';
import { IcCreate, IcDelete, IcUser } from 'components/icons';
import LoadingButton from 'components/LoadingButton';
import { BrowserDidCtx, DidCtx, useToggle } from 'hooks';
import { isBindDid } from 'hooks/useQueryBind';
import { useUnlock } from 'hooks/useUnlock';
import { memo, useCallback, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { api, bindWalletWithDid, generate, generateBindText, isCreateMnemonic, siweLogin } from 'utils';
import { bytesToHex, stringToHex } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';

import { Did } from '@zcloak/did';
import { DidAccount } from '@zcloak/wallet-lib';

interface Props {
  open: boolean;
  onClose: () => void;
  toggleImport: () => void;
}
interface ItemProps {
  did: Did | null | undefined;
  // onDelete: (didAccount: DidAccount) => void;
}

function Item({ did }: ItemProps) {
  const { did: current, setDid } = useContext(DidCtx);
  const { address } = useAccount();
  const { didAccounts } = useContext(BrowserDidCtx);
  const [loading, toggle] = useToggle();
  const [loadingDel, toggleDel] = useToggle();
  const { signMessageAsync } = useSignMessage();
  const [unlock] = useUnlock();

  const login = useCallback(async () => {
    if (!did || !address) return;

    try {
      toggle();

      await unlock();

      const isBind = await isBindDid(address, did?.id);

      if (!isBind) {
        await bindWalletWithDid(did, address, signMessageAsync);
      }

      didAccounts?.setCurrent(did.id);

      await siweLogin('zkid-browser', did);

      setDid(did);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggle();
    }
  }, [toggle, setDid, did, unlock, signMessageAsync, address, didAccounts]);

  const isLogin = useMemo(() => did?.id === current?.id, [did, current]);

  const deleteDid = useCallback(async () => {
    try {
      if (!did || !address) return;

      toggleDel();

      if (isLogin) {
        throw new Error('Can not delete logged did.');
      }

      const isBind = await isBindDid(address, did?.id);

      if (isBind) {
        const bindTime = Date.now();

        const message = generateBindText('eth', did.id, address, bindTime);
        const didSig = await did.signWithKey(stringToHex(message), 'controller');
        const ethSignature = await signMessageAsync({ message });

        await api.unbindEthDid({
          didUrl: did.id,
          onChainAddress: address,
          chainCode: 'eth',
          walletSignature: ethSignature,
          didSignature: bytesToHex(didSig.signature),
          timestamp: bindTime
        });
      }

      await didAccounts?.removeAccount(did?.id);
      toast.success('Remove did success.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggleDel();
    }
  }, [isLogin, didAccounts, did, toggleDel, address, signMessageAsync]);

  return (
    <Stack
      alignItems='center'
      borderBottom='1px solid #D7DBEC'
      direction='row'
      justifyContent='space-between'
      px={2}
      py={1.6}
    >
      <AccountName value={did?.id} />
      <Box>
        {isLogin ? (
          <IconButton disableRipple>
            <DoneIcon />
          </IconButton>
        ) : (
          <IconButton disabled={loading} onClick={login}>
            {loading ? <CircularProgress size={16} /> : <IcUser />}
          </IconButton>
        )}

        <IconButton disabled={loadingDel} onClick={deleteDid}>
          {loadingDel ? <CircularProgress size={16} /> : <IcDelete />}
        </IconButton>
      </Box>
    </Stack>
  );
}

const ManageDids: React.FC<Props> = ({ onClose, open, toggleImport }) => {
  const { address } = useAccount();
  // const { accounts, didAccounts } = useDidAccounts(address);
  const { accounts, didAccounts, keyring } = useContext(BrowserDidCtx);

  const { signMessageAsync } = useSignMessage();
  const [unlock] = useUnlock();
  const { setDid } = useContext(DidCtx);
  const [loading, toggle] = useToggle();

  const create = useCallback(async () => {
    if (!didAccounts || !address) return;

    let did: DidAccount | undefined;

    try {
      toggle();

      await unlock();

      const isCreated = await isCreateMnemonic(address);

      if (isCreated) {
        did = await didAccounts.deriveAccount();
      } else {
        did = await generate(didAccounts, keyring?.password);
      }

      const didUrl = did.instance.id;

      const bindTime = Date.now();

      const message = generateBindText('eth', did.instance.id, address, bindTime);
      const didSig = await did.instance.signWithKey(stringToHex(message), 'controller');
      const ethSignature = await signMessageAsync({ message });

      const result = await api.bindEthDid({
        didUrl: did.instance.id,
        onChainAddress: address,
        chainCode: 'eth',
        walletSignature: ethSignature,
        didSignature: bytesToHex(didSig.signature),
        timestamp: bindTime
      });

      if (result) {
        await siweLogin('zkid-browser', did.instance);

        didAccounts.setCurrent(didUrl);

        setDid(did.instance);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggle();
    }
  }, [didAccounts, address, setDid, toggle, unlock, signMessageAsync, keyring]);

  const importDid = () => {
    toggleImport();
    onClose();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogHeader onClose={onClose} sx={{ textAlign: 'center' }}>
          My Accounts
        </DialogHeader>
        <DialogContent>
          <Typography color='#333333' mb={3} textAlign='center' variant='body1'>
            Manage your accounts: create, import, delete, and switch for login.
          </Typography>
          <Box bgcolor='#F7F7F7' border='1px solid #D9E0EC' borderRadius='10px'>
            {accounts?.map((item) => {
              return <Item did={item.instance} key={item.instance.id} />;
            })}
            <LoadingButton
              fullWidth
              loading={loading}
              onClick={create}
              size='large'
              startIcon={loading ? <></> : <IcCreate />}
              variant='text'
            >
              Create Account
            </LoadingButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} size='large' variant='outlined'>
            Cancel
          </Button>
          <Button fullWidth onClick={importDid} size='large'>
            Import Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(ManageDids);
