import React from 'react';
import { CardContent, CircularProgress } from '@material-ui/core';

interface IProps {
  loading?: boolean;
}

const ProgressCardContent: React.FC<IProps> = ({
  loading = false,
  children,
}) => <CardContent>{loading ? <CircularProgress /> : children}</CardContent>;

export default ProgressCardContent;
