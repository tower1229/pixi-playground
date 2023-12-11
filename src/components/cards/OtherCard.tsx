// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { ellipsisMixin } from 'components/utils';
import moment from 'moment';
import React, { useMemo } from 'react';

import { DidUrl } from '@zcloak/did-resolver/types';

import AccountName from '../AccountName';
import { IconContactless } from '../icons';
import CardContainer from './CardContainer';
import { categoryMap, isCategory } from './categories';
import { ZkIDCardProps } from './types';

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack color='inherit'>
      <Typography color='inherit' fontSize={10}>
        {label}
      </Typography>
      {value}
    </Stack>
  );
}

const OtherCard: React.FC<ZkIDCardProps> = ({ onClick, template, vc }) => {
  const { category, expirationTime } = useMemo(() => {
    return template
      ? {
          expirationTime: moment(template.createdTime + template.duration).format('YYYY-MM-DD'),
          category: template.category
        }
      : {};
  }, [template]);
  // previewBg ? previewBg : template.bg ? `https://zcloak.s3.us-east-2.amazonaws.com${template?.bg}` : '/images/card/img_card_3.png'
  const bg = useMemo(() => template?.background ?? '/images/card/img_card_3.png', [template?.background]);

  const issuer = useMemo(() => (vc?.version === '2' ? vc?.issuer?.[0] : (vc?.issuer as DidUrl)), [vc]);

  return (
    <CardContainer bg={bg}>
      <Box
        onClick={onClick}
        p={2.4}
        sx={{
          color: template?.color,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          ':hover': {
            cursor: onClick ? 'pointer' : 'unset'
          }
        }}
      >
        <Stack alignItems='center' direction='row' justifyContent='space-between'>
          <Typography>{isCategory(category) && categoryMap[category]}</Typography>
          <IconContactless />
        </Stack>
        <Tooltip arrow placement='top-start' title={template?.title}>
          <Typography color='inherit' flexShrink={0} fontSize={20} mb={1} mt={5} sx={{ ...ellipsisMixin() }}>
            {template?.title}
          </Typography>
        </Tooltip>
        <Stack color='inherit' direction='row' justifyContent='space-between'>
          <Item label='ISSUER' value={<AccountName value={issuer} />} />
          <Item label='EXPIRE DATE' value={expirationTime} />
        </Stack>
      </Box>
    </CardContainer>
  );
};

export default React.memo(OtherCard);
