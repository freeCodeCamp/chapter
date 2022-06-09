import { CircularProgress, Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  loading?: boolean;
  children: React.ReactNode;
}

const ProgressCardContent = ({ loading = false, children }: Props) => (
  <Box m="5px 0px">
    {loading ? <CircularProgress isIndeterminate /> : children}
  </Box>
);

export default ProgressCardContent;
