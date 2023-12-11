// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@zcloak/crypto/types';
import { CTypeSchema } from '@zcloak/ctype/types';
import { DidUrl } from '@zcloak/did-resolver/types';

import { ApplicationProps } from '../utils/types';
import { BaseTempProps, CARD_TYPE } from './cards/types';

export interface BaseInputProps<T> {
  value?: T;
  defaultValue?: T;
  disabled?: boolean;
  onChange?: (value: T) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: Error | null;
  autoFocus?: boolean;
  placeholder?: string;
  type?: string;
  fullWidth?: boolean;
  size?: 'medium' | 'small';
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  children?: React.ReactNode;
}

export interface TemplateInterface extends BaseTempProps {
  id: number;
  desc: string;
  title: string;
  issuer: DidUrl;
  public: number;
  duration: number;
  background: string;
  logo: string;
  ctypeHash: HexString;
  creator: DidUrl;
  category: CARD_TYPE;
  color: string;
  applications: ApplicationProps[];
  trending: number;
  createdTime: number;
}

export interface DraftsProps {
  title?: string;
  desc?: string;
  category?: CARD_TYPE;
  duration?: number;
  background?: string;
  logo?: string;
  color?: string;
  applications?: ApplicationProps[];
  onChainAsset?: number;
  public: number;
  fields?: Record<string, CTypeSchema>;
}
export interface RequestSaveDraft {
  id: string;
  draft: DraftsProps;
}
export interface DraftInterface extends RequestSaveDraft {
  createdTime: string;
  modifyTime: string;
}
