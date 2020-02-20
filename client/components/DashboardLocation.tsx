import React, { useState } from 'react';
import { Card, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import ProgressCardContent from './ProgressCardContent';
import { ILocationModal } from 'client/store/types/locations';
import { locationActions } from 'client/store/actions';

interface IDashboardLocationProps {
  location: ILocationModal;
  loading: boolean;
}

const DashboardLocation: React.FC<IDashboardLocationProps> = ({
  location,
  loading,
}) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const dispatch = useDispatch();

  const remove = () => {
    dispatch(locationActions.remove(location.id));
  };

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

        {confirm ? (
          <Button onClick={remove}>Are you sure</Button>
        ) : (
          <Button onClick={() => setConfirm(true)}>DELETE</Button>
        )}
      </ProgressCardContent>
    </Card>
  );
};

export default DashboardLocation;
