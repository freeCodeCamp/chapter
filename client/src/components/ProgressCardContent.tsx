import { CardContent, CircularProgress } from '@material-ui/core';
import React from 'react';

interface Props {
  loading?: boolean;
}

const ProgressCardContent: React.FC<Props> = ({
  loading = false,
  children,
}) => <CardContent>{loading ? <CircularProgress /> : children}</CardContent>;

export default ProgressCardContent;
