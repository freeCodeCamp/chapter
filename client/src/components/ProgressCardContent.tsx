import { CircularProgress, Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  loading?: boolean;
}

const ProgressCardContent: React.FC<Props> = ({
  loading = false,
  children,
}) => (
  <Box m="5px 0px">
    {loading ? <CircularProgress isIndeterminate /> : children}
  </Box>
);

export default ProgressCardContent;
