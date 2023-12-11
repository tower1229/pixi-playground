// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

const Wrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  '::before': {
    content: "''",
    display: 'block',
    paddingTop: 'calc(54 / 85.6 * 100%)'
  },

  '.Card_Content': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    overflow: 'hidden'
  }
}));

interface Props extends PropsWithChildren {
  bg?: string;
}

const CardContainer: React.FC<Props> = ({ bg, children }) => {
  return (
    <Wrapper>
      <Box
        className='Card_Content'
        sx={{
          background: `url(${bg}) no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        {children}
      </Box>
    </Wrapper>
  );
};

export default CardContainer;
