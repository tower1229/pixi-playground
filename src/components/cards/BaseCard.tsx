// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import CardAction from 'components/actions/CardAction';
import CardDetails from 'components/CardDetails';
import { useToggle } from 'hooks';
import { memo } from 'react';

import { findCard } from './findCard';
import OldCard from './OldCard';
import { ZkIDCardProps } from './types';

interface Props {
  isOpen?: boolean;
}

const BasicCard: React.FC<ZkIDCardProps & Props> = ({ isOpen, template, vc }) => {
  const [open, toggle] = useToggle();
  const Card = typeof template?.category === 'number' ? findCard(template?.category) : OldCard;

  return (
    <>
      {open && (
        <CardDetails
          actions={<>{vc && <CardAction template={template} vc={vc} />}</>}
          onClose={toggle}
          open={open}
          template={template}
          vc={vc}
        />
      )}
      <Card onClick={isOpen ? toggle : undefined} template={template} vc={vc} />
    </>
  );
};

export default memo(BasicCard);
