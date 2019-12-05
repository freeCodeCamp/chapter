import React from 'react';
import { CardContent, CircularProgress } from '@material-ui/core';

interface IProps {
  loading: boolean;
}

const ProgressCardContent: React.FC<IProps> = props => (
  <CardContent>
    {props.loading ? <CircularProgress /> : props.children}
  </CardContent>
);

export default ProgressCardContent;
