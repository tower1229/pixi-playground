// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CType } from '@zcloak/ctype/types';
import { DidUrl } from '@zcloak/did-resolver/types';

import { CARD_TYPE } from '../components/cards/types';

export interface ServerResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export type RequestCreateTemplate = {
  ctype?: CType;
  title?: string;
  desc?: string;
  category?: CARD_TYPE;
  onChainAsset?: number[];
  public?: number;
  duration?: number;
  background?: string;
  logo?: string;
  color?: string;
  applications?: ApplicationProps[];
};

export type ApplicationProps = {
  title: string;
  url: string;
  visiable: boolean;
};

export type RequestIssueCard = {
  owner: DidUrl;
  templateId: number;
  contents: object;
  duration?: number;
  isPublic?: boolean;
};
