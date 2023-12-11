// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, FormControl, FormHelperText, InputLabel, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

import { IconUpload } from '../icons';
import { InputFileProps } from './types';

function UploadCardBg({
  disabled,
  error: errorProps,
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
    <FormControl error={errors.length > 0} fullWidth size={size} variant='outlined'>
      {label && <InputLabel shrink>{label}</InputLabel>}

      <Box
        {...getRootProps()}
        onClick={open}
        sx={{
          width: '100%',
          height: 210,
          background: `${previewImage ? `url(${previewImage})` : '#707070'} no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <IconUpload fontSize='large' />
        <Typography color='primary.contrastText' mt={1}>
          Add Background
        </Typography>
      </Box>

      <input {...getInputProps()} />

      <Typography color='grey.500' fontSize='0.875rem'>
        {placeholder}
      </Typography>

      {helper && (
        <FormHelperText
          sx={{
            marginLeft: 0,
            marginTop: 6
          }}
        >
          {helper}
        </FormHelperText>
      )}
      <Box pt={3}>
        {errors.map((error, index) => (
          <FormHelperText key={index}>{error.message}</FormHelperText>
        ))}
      </Box>
    </FormControl>
  );
}

export default React.memo(UploadCardBg);
