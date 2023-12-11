// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar, FormControl, FormHelperText, IconButton, InputLabel, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

import { IconAddLogo } from '../icons';
import { InputFileProps } from './types';

function FileUpload({
  disabled,
  error: errorProps,
  fullWidth,
  helper,
  label,
  onChange,
  options,
  placeholder,
  previewImage,
  size
}: InputFileProps & { previewImage?: string }) {
  const { fileRejections, getInputProps, getRootProps, open } = useDropzone({
    ...options,
    disabled,
    onDropAccepted: onChange,
    noClick: true,
    noKeyboard: true
  });

  const errors = useMemo((): Error[] => {
    const _errors: Error[] = [];

    if (errorProps) _errors.push(errorProps);
    fileRejections.forEach(({ errors }) => {
      _errors.push(...errors.map((err) => new Error(err.message)));
    });

    return _errors;
  }, [errorProps, fileRejections]);

  return (
    <FormControl error={errors.length > 0} fullWidth={fullWidth} size={size} variant='outlined'>
      {label && (
        <InputLabel shrink sx={{ '&.MuiInputLabel-root': { color: '#0A1629', fontSize: '16px', fontWeight: 'bold' } }}>
          {label}
        </InputLabel>
      )}
      <Stack
        {...getRootProps()}
        alignItems='center'
        direction='row'
        maxWidth={80}
        onClick={open}
        padding={1.25}
        spacing={3}
      >
        {previewImage ? (
          <Avatar
            src={previewImage}
            sx={{
              width: 55,
              height: 55
            }}
            variant='circular'
          />
        ) : (
          <IconButton
            onClick={open}
            sx={{
              border: '1px dashed #97A0C3',
              borderRadius: '50%',
              width: '55px',
              height: '55px'
            }}
          >
            <IconAddLogo />
          </IconButton>
        )}
        <input {...getInputProps()} />

        <Typography color='grey.500' fontSize='0.875rem'>
          {placeholder}
        </Typography>
      </Stack>
      {helper && (
        <FormHelperText
          sx={{
            marginLeft: 0,
            marginTop: 1.5
          }}
        >
          {helper}
        </FormHelperText>
      )}
      {errors.map((error, index) => (
        <FormHelperText key={index}>{error.message}</FormHelperText>
      ))}
    </FormControl>
  );
}

export default React.memo(FileUpload);
