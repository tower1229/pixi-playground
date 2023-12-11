// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, FormControl, FormHelperText, InputLabel, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import IconCsvDropSvg from '../../assets/svg/icon_csv_drop.svg';
import { InputFileProps } from './types';

function UploadBulkCsv({
  disabled,
  error: errorProps,
  exampleAction,
  helper,
  label,
  onChange,
  options,
  placeholder,
  size
}: InputFileProps & { onChange: (files: File[]) => void; exampleAction: React.ReactNode }) {
  const { fileRejections, getRootProps, open } = useDropzone({
    ...options,
    disabled,
    onDropAccepted: (files) => {
      onCsvChange(files);
    },
    noClick: true,
    noKeyboard: true
  });
  const [filename, setFilename] = useState<string>();
  const onCsvChange = useCallback(
    (files: File[]) => {
      setFilename(files?.[0].name);
      onChange(files);
    },
    [onChange]
  );
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

      <Stack
        py={2}
        {...getRootProps()}
        onClick={open}
        sx={{
          width: '100%',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '1px dashed #A1A7C4'
        }}
      >
        <IconCsvDropSvg />
        {!filename && (
          <Typography
            sx={{
              width: '200px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 400,
              color: '#333333',
              span: { textDecoration: 'underline' }
            }}
          >
            Drag and Drop files here or <span>Browse</span> to upload
          </Typography>
        )}
        <Typography>{filename}</Typography>
      </Stack>
      {exampleAction}

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

export default UploadBulkCsv;
