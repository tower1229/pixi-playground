// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar, Box, Divider, Paper, Stack, SxProps, Theme, Typography } from '@mui/material';
import { useCType } from 'hooks';
import { useWebsiteMeta } from 'hooks/useWebsiteMeta';
import moment from 'moment';
import React, { PropsWithChildren, useMemo } from 'react';
import { isHex } from 'viem';

import { isDidUrl } from '@zcloak/did';
import { DidUrl } from '@zcloak/did-resolver/types';

import AccountName from '../AccountName';
import { categoryMap } from './categories';
import { ApplicationProps, ZkIDCardProps } from './types';

export function ItemWrapper({ children, sx }: PropsWithChildren & { sx?: SxProps<Theme> }) {
  return (
    <Stack bgcolor='#F7F7F7' borderRadius='8px' minHeight={42} paddingX={2} paddingY={1} sx={sx}>
      {children}
    </Stack>
  );
}

export function Label({ label }: { label: string }) {
  return (
    <Typography color='grey.500' fontSize={12}>
      {label}
    </Typography>
  );
}

function InfoItem({ label, value }: { label?: string; value?: string | number }) {
  return (
    <Stack alignItems='center' direction='row' justifyContent='space-between' marginY={1}>
      <Typography color='grey.500'>{label}</Typography>
      <Typography>{isDidUrl(value) || isHex(value) ? <AccountName value={value} /> : value}</Typography>
    </Stack>
  );
}

function Application({ app }: { app: ApplicationProps }) {
  const meta = useWebsiteMeta(app.url);

  return (
    <ItemWrapper sx={{ flexDirection: 'row', alignItems: 'center' }}>
      <Avatar src={`${meta.origin}/favicon.ico`} />
      <Typography ml={1}>{app.title}</Typography>
    </ItemWrapper>
  );
}

const CardInfo: React.FC<ZkIDCardProps> = ({ template, vc }) => {
  const { ctype } = useCType(vc?.ctype);
  const { applications, category, createdTime, ctypeHash, desc, duration, id } = useMemo(() => {
    return {
      ...template,
      applications: template?.applications,
      category: template?.category,
      createdTime: template?.createdTime,
      ctypeHash: template?.ctypeHash ?? vc?.ctype,
      desc: template?.desc ?? ctype?.description
    };
  }, [template, vc, ctype]);

  const expirationTime = useMemo(() => {
    if (createdTime && duration) {
      return moment(createdTime + duration).format('YYYY-MM-DD');
    }

    if (vc?.expirationDate) {
      return moment(vc?.expirationDate).format('YYYY-MM-DD');
    }

    return undefined;
  }, [createdTime, duration, vc]);

  const issuer = useMemo(
    () => (vc ? (vc?.version === '2' ? vc?.issuer?.[0] : (vc?.issuer as DidUrl)) : template?.creator),
    [vc, template?.creator]
  );

  return (
    <Paper
      sx={{
        height: 500,
        width: '100%',
        padding: 3,
        boxShadow: '0px 3px 30px 1px rgba(121,145,173,0.2)',
        overflowY: 'scroll'
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Label label='DESCRIPTION' />
          <ItemWrapper>{desc}</ItemWrapper>
        </Box>
        <Box>
          <Label label='CARD INFO' />
          <ItemWrapper
            sx={{
              '.MuiDivider-root': {
                borderColor: '#FFF'
              }
            }}
          >
            <InfoItem label='TEMPLATE ID' value={id} />
            <Divider />
            <InfoItem label='EXPIRE TIME' value={expirationTime} />
            <Divider />
            <InfoItem label='ISSUER' value={issuer} />
            <Divider />
            <InfoItem label='CATEGORY' value={category !== undefined ? categoryMap[category] : ''} />
            {/* <Divider /> */}
            {/* <InfoItem label='HOLDER' value={holder} /> */}
          </ItemWrapper>
        </Box>
        <Box>
          <Label label='DATA FIELD HASH' />
          <ItemWrapper
            sx={{
              wordBreak: 'break-all'
            }}
          >
            <Typography>{ctypeHash}</Typography>
          </ItemWrapper>
        </Box>
        <Box>
          <Label label='APPLICATIONS' />
          {applications ? (
            applications?.map((item, idx) => {
              return <Application app={item} key={idx} />;
            })
          ) : (
            <ItemWrapper />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default React.memo(CardInfo);
