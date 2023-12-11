// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { isHex } from 'viem';

import { DidUrl } from '@zcloak/did-resolver/types';

import AccountName from '../AccountName';
import { IconContactless } from '../icons';
import CardContainer from './CardContainer';
import { ZkIDCardProps } from './types';

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack color='inherit'>
      <Typography color='inherit'>{label}</Typography>
      {value}
    </Stack>
  );
}

const MembershipCard: React.FC<ZkIDCardProps> = ({ onClick, template, vc }) => {
  const { name, role } = useMemo(() => {
    if (isHex(vc?.credentialSubject) || !vc?.credentialSubject) {
      return {
        name: 'Name',
        role: 'Role'
      };
    } else {
      return {
        name: vc.credentialSubject.Name,
        role: vc.credentialSubject.Role
      };
    }
  }, [vc?.credentialSubject]);
  // const bg = useMemo(() => `https://zcloak.s3.us-east-2.amazonaws.com${template?.background}` ?? '/images/card/img_card_1.png', [template?.background]);
  const bg = useMemo(() => template?.background ?? '/images/card/img_card_1.png', [template?.background]);

  const issuer = useMemo(() => (vc?.version === '2' ? vc?.issuer?.[0] : (vc?.issuer as DidUrl)), [vc]);

  return (
    <CardContainer bg={bg}>
      <Box
        onClick={onClick}
        p={2.4}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: template?.color ?? '#FFF',
          ':hover': {
            cursor: onClick ? 'pointer' : 'unset'
          }
        }}
      >
        <Stack direction='row' justifyContent='space-between'>
          <Typography color='inherit'>MEMBERSHIP</Typography>

          <IconContactless />
        </Stack>
        <Box flexShrink={0}>
          <Typography color='inherit' fontSize={24} mt={3} textAlign='center'>
            {name}
          </Typography>
          <Typography color='inherit' textAlign='center'>
            {role}
          </Typography>
        </Box>
        <Stack alignItems='center' direction='row' mt={1} spacing={1}>
          {template?.logo && <Avatar src={template?.logo} />}
          <Item label='ISSUER' value={<AccountName value={issuer} />} />
        </Stack>
      </Box>
    </CardContainer>
  );
};

export default React.memo(MembershipCard);
