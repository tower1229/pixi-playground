// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

function ToastRoot() {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <ToastContainer
      autoClose={5000}
      closeOnClick
      draggable
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position="top-center"
      rtl={false}
    />
  );
}

export default React.memo(ToastRoot);
