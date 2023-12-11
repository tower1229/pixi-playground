// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Typography } from '@mui/material';

import { NativeType, NativeTypeWithOutNull } from '@zcloak/vc/types';

import { ItemWrapper } from './CardField';
import { Label } from './CardInfo';

export default function CTypeFieldItem({
  label,
  value
}: {
  label: string;
  value?: NativeType | NativeTypeWithOutNull[];
}) {
  return (
    <ItemWrapper>
      <Label label={label} />
      <Typography>{value}</Typography>
    </ItemWrapper>
  );
}
