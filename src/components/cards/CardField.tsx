// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Paper, Stack, Typography } from '@mui/material';
import { isHex } from '@polkadot/util';
import React, { PropsWithChildren, useContext, useMemo } from 'react';

import { useCType, useTemplateWrite } from '../../hooks';
import { TemplateCtx } from '../../hooks/ctx/Template';
import UploadCardBg from '../upload/UploadCardBg';
import BaseCard from './BaseCard';
import { Label } from './CardInfo';
import { ClaimItem } from './ClaimItem';
import { ZkIDCardProps } from './types';

export function ItemWrapper({ children }: PropsWithChildren) {
  return (
    <Stack bgcolor='#F7F7F7' borderRadius='8px' paddingX={2} paddingY={1}>
      {children}
    </Stack>
  );
}

export function FieldItem({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <ItemWrapper>
      <Label label={label} />
      <Typography>{value}</Typography>
    </ItemWrapper>
  );
}

type Props = Omit<ZkIDCardProps, 'size'> & {
  isEdit?: boolean;
};

const CardField: React.FC<Props> = ({ isEdit = false, template, vc }) => {
  const { previewBg, template: created } = useContext(TemplateCtx);

  const { onBgChange } = useTemplateWrite();

  const { fields, subject } = useMemo(() => {
    return { fields: created?.fields, subject: vc?.credentialSubject };
  }, [created, vc]);

  const { ctype } = useCType(template?.ctypeHash);

  return (
    <Paper
      sx={{
        width: '100%',
        height: 500,
        p: 2.4,
        overflowY: 'scroll',
        boxShadow: '0px 3px 30px 1px rgba(121,145,173,0.2)'
      }}
    >
      {isEdit ? (
        <UploadCardBg onChange={onBgChange} previewImage={previewBg || created?.background} />
      ) : (
        <BaseCard template={template} vc={vc} />
      )}
      <Stack marginY={3} spacing={2}>
        {isEdit ? (
          <>
            {fields
              ? Object.keys(fields).map((keyItem) => {
                  return <FieldItem key={keyItem} label={keyItem} value={fields[keyItem].type} />;
                })
              : undefined}
          </>
        ) : (
          <>
            {subject && !isHex(subject)
              ? Object.entries(subject).map(([key, val]) => {
                  return <ClaimItem format={ctype?.properties?.[key].format} key={key} label={key} value={val} />;
                })
              : undefined}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default React.memo(CardField);
