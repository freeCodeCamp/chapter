import React from 'react';
import { Card, Typography } from '@material-ui/core';

import ProgressCardContent from './ProgressCardContent';
import { ILocationModal } from 'client/store/types/locations';

interface IDashboardLocationProps {
  location: ILocationModal;
  loading: boolean;
}

const DashboardLocation: React.FC<IDashboardLocationProps> = ({
  location,
  loading,
}) => {
  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <Typography gutterBottom variant="h5" component="h2">
          {location.city}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {`${location.region}, ${location.country_code}, ${location.postal_code}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {location.address}
        </Typography>
      </ProgressCardContent>
    </Card>
  );
};

export default DashboardLocation;
