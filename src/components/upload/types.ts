// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropzoneOptions } from 'react-dropzone';

import React from 'react';

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

export type InputStringProps = BaseInputProps<string>;
export type InputFileProps = BaseInputProps<File[]> & {
  options?: Omit<DropzoneOptions, 'onDrop' | 'onDropAccepted'>;
};
