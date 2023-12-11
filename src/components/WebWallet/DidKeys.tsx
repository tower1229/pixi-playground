// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography } from '@mui/material';
import AccountName from 'components/AccountName';
import Address from 'components/Address';
import DialogHeader from 'components/common/DialogHeader';
import Copy from 'components/Copy';
import { PHASE_KEY } from 'config/token';
import saveAs from 'file-saver';
import { BrowserDidCtx } from 'hooks';
import { useUnlock } from 'hooks/useUnlock';
import { useCallback, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import { store } from 'utils/store';
import { toHex } from 'viem';
import { useAccount } from 'wagmi';

import { HexString } from '@zcloak/crypto/types';
import { Did } from '@zcloak/did';
import { DidUrl } from '@zcloak/did-resolver/types';

interface Props {
  did: Did;
  open: boolean;
  onClose: () => void;
}
interface ItemProps {
  label: string;
  showKey: React.ReactNode;
  value?: HexString | DidUrl | null;
}

function Item({ label, showKey, value }: ItemProps) {
  return (
    <Stack alignItems='center' direction='row' justifyContent='space-between' px={2} py={1.6}>
      <Box>
        <Typography color='#5D5D5B' fontSize={12}>
          {label}
        </Typography>
        <Typography fontSize={14} fontWeight={600}>
          {showKey}
        </Typography>
      </Box>
      {value && <Copy value={value} />}
    </Stack>
  );
}

const DidKeys: React.FC<Props> = ({ did, onClose, open }) => {
  const { address } = useAccount();
  const { didAccounts } = useContext(BrowserDidCtx);

  const [unlock] = useUnlock();

  const exportDid = useCallback(async () => {
    try {
      await unlock();

      const json = didAccounts?.exportDidFile(did.id);

      const phase = await store.get(`${address}${PHASE_KEY}`);

      const blob = new Blob([JSON.stringify({ keys: json, originPhase: phase })], {
        type: 'text/plain;charset=utf-8'
      });

      saveAs(blob, `${did.id}.json`);

      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [did, unlock, didAccounts, address, onClose]);

  const authenticationKey = useMemo(() => {
    try {
      const didUrl = did.getKeyUrl('authentication');

      return toHex(did.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const assertionMethodKey = useMemo(() => {
    try {
      const didUrl = did.getKeyUrl('assertionMethod');

      if (!didUrl) return null;

      return toHex(did.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const keyAgreementKey = useMemo(() => {
    try {
      const didUrl = did.getKeyUrl('keyAgreement');

      if (!didUrl) return null;

      return toHex(did.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const capabilityDelegationKey = useMemo(() => {
    try {
      const didUrl = did.getKeyUrl('capabilityDelegation');

      if (!didUrl) return null;

      return toHex(did.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const capabilityInvocationKey = useMemo(() => {
    try {
      const didUrl = did.getKeyUrl('capabilityInvocation');

      if (!didUrl) return null;

      return toHex(did.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogHeader onClose={onClose} sx={{ textAlign: 'center' }}>
        My Keys
      </DialogHeader>
      <DialogContent>
        <Typography mb={2} textAlign='center'>
          You can export your keys file future account restoration.
        </Typography>
        <Box
          sx={{
            background: '#F7F7F7',
            border: '1px solid #D9E0EC',
            borderRadius: '10px'
          }}
        >
          <Item label='DID Account' showKey={<AccountName value={did.id} />} value={did.id} />
          <Divider />
          <Item label='Authentication' showKey={<Address value={authenticationKey} />} value={authenticationKey} />
          <Divider />
          <Item label='Assertion' showKey={<AccountName value={assertionMethodKey} />} value={assertionMethodKey} />
          <Divider />
          <Item label='Key Agreement' showKey={<AccountName value={keyAgreementKey} />} value={keyAgreementKey} />
          <Divider />
          <Item
            label='Capability Delegation'
            showKey={<AccountName value={capabilityDelegationKey} />}
            value={capabilityDelegationKey}
          />
          <Divider />
          <Item
            label='Capability Invocation'
            showKey={<AccountName value={capabilityInvocationKey} />}
            value={capabilityInvocationKey}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button fullWidth size='large' variant='outlined'>
          Cancel
        </Button>
        <Button fullWidth onClick={exportDid} size='large'>
          Export Keys File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DidKeys;
