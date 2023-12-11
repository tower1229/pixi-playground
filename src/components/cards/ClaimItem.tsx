// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NativeType, NativeTypeWithOutNull } from '@zcloak/vc/types';

import { alpha, Box } from '@mui/material';
import { national } from 'config';
import React, { useMemo } from 'react';

import AccountName from '../AccountName';
import { FieldItem } from './CardField';

export const ClaimItem: React.FC<{
  label: string;
  value: React.ReactElement | NativeType | NativeTypeWithOutNull[];
  format?: string; // 'date' | 'time' | 'date-time' | 'url' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'int32' | 'int64' | 'uint32' | 'uint64' | 'float' | 'double' | 'bytes' | 'hex' | 'did' | 'timestamp' | 'national-code'
}> = ({ format, label, value }) => {
  const el = useMemo(() => {
    if (value && React.isValidElement(value)) {
      return value;
    }

    const type = typeof value;

    if (['string', 'number', 'undefined'].includes(type)) {
      if (format === 'timestamp') {
        return <>{new Date(Number(value)).toLocaleString()}</>;
      } else if (format === 'did') {
        return <AccountName value={value as string} />;
      } else if (format === 'national-code') {
        const finded = national[String(value)];

        return <>{finded ? finded.name : JSON.stringify(value)}</>;
      }

      return <>{value}</>;
    } else if (typeof value === 'boolean') {
      return (
        <Box
          sx={({ palette }) => ({
            background: alpha(value ? palette.success.main : palette.error.main, 0.2),
            color: value ? palette.success.main : palette.error.main,
            borderRadius: 1,
            width: 92,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          {value ? 'True' : 'False'}
        </Box>
      );
    } else {
      return <>{JSON.stringify(value)}</>;
    }
  }, [format, value]);

  return <FieldItem label={label} value={el} />;
};
