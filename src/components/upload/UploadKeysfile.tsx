// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { InputFileProps } from "./types";

function UploadKeysfile({
  disabled,
  error: errorProps,
  helper,
  label,
  onChange,
  options,
  placeholder,
}: InputFileProps) {
  const [file, setFile] = useState<File | null>(null);
  const onFileChange = useCallback(
    (files?: File[]) => {
      const file = files?.[0];

      if (file) {
        setFile(file);
        onChange?.([file]);
      } else {
        setFile(null);
      }
    },
    [onChange]
  );

  const { fileRejections, getInputProps, getRootProps, open } = useDropzone({
    ...options,
    disabled,
    onDropAccepted: onFileChange,
    noClick: true,
    noKeyboard: true,
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
    <div>
      <div>{label}</div>

      <div className="pb-4 pt-4 gap-2 rounded flex flex-col items-center justify-center cursor-pointer border border-[#ECECEE] overflow-hidden">
        <div
          style={{
            background: "url(images/img_restoration.svg)",
            width: 100,
            height: 100,
            backgroundSize: "cover",
          }}
        />

        <div className="text-[#333]">
          Drag and Drop files here or Browse to upload
        </div>
        <div>{file?.name}</div>
      </div>

      <input {...getInputProps()} />

      <div className="text-text2 text-sm">{placeholder}</div>

      {helper && <div>{helper}</div>}
      <div className="pt-2">
        {errors.map((error, index) => (
          <div key={index} className="alert alert-error">
            {error.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadKeysfile;
