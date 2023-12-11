// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import React from 'react';

import BaseCard from './BaseCard';
import { ZkIDCardProps } from './types';

const PreviewCard: React.FC<ZkIDCardProps> = ({ template }) => {
  return (
    <Box
      height={399}
      mt={2}
      p={8}
      position='absolute'
      right={30}
      sx={{
        flexDirection: 'column',
        background: 'linear-gradient(90deg, #131417 0%, #686D6F 100%, rgba(19, 20, 23, 0.68) 0%)',
        boxShadow: '0px 20px 50px 1px rgba(0,0,0,0.16)',
        borderRadius: '10px'
      }}
      width={498}
    >
      <BaseCard template={template} />
      <Box
        sx={{
          width: '100%',
          height: 73,
          background: 'linear-gradient(180deg, rgba(29,36,67,0.53) 0%, rgba(50,50,50,0) 66%, rgba(57,57,57,0) 100%)',
          borderRadius: '17px 17px 0px 0px'
        }}
      ></Box>
    </Box>
  );
};

export default React.memo(PreviewCard);
