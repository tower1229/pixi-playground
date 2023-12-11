// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { ellipsisMixin } from 'components/utils';
import { useCType } from 'hooks';
import moment from 'moment';
import React, { useMemo } from 'react';

import { DidUrl } from '@zcloak/did-resolver/types';

import AccountName from '../AccountName';
import { IconContactless } from '../icons';
import CardContainer from './CardContainer';
import { ZkIDCardProps } from './types';

// const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: 'rgba(0, 0, 0, 0.87)',
//     boxShadow: theme.shadows[1],
//     fontSize: 11,
//     borderRadius: theme.spacing(0.5)
//   },
//   [`& .${tooltipClasses.arrow}`]: {
//     color: theme.palette.common.white
//   }
// }));
function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack color='inherit'>
      <Typography color='inherit'>{label}</Typography>
      {value}
    </Stack>
  );
}

const OldCard: React.FC<ZkIDCardProps> = ({ onClick, vc }) => {
  const expirationTime = useMemo(() => {
    return vc?.expirationDate ? moment(vc.expirationDate).format('YYYY-MM-DD') : null;
  }, [vc]);

  const { ctype } = useCType(vc?.ctype);

  const issuer = useMemo(() => (vc?.version === '2' ? vc?.issuer?.[0] : (vc?.issuer as DidUrl)), [vc]);

  return (
    <CardContainer bg='/images/card/pic_card1.webp'>
      <Box
        onClick={onClick}
        p={2.4}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFF',
          ':hover': {
            cursor: onClick ? 'pointer' : 'unset'
          }
        }}
      >
        <Stack alignItems='center' direction='row' justifyContent='space-between'>
          <Typography>Legacy</Typography>
          <IconContactless />
        </Stack>
        <Tooltip placement='top-start' title={ctype?.title}>
          <Typography color='inherit' flexShrink={0} fontSize={24} mb={1} mt={5} sx={{ ...ellipsisMixin() }}>
            {ctype?.title}
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

export default React.memo(OldCard);
