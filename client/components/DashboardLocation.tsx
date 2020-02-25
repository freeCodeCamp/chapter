import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  makeStyles,
  Link as MULink,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import ProgressCardContent from './ProgressCardContent';
import { ILocationModal } from 'client/store/types/locations';
import { locationActions } from 'client/store/actions';

interface IDashboardLocationProps {
  location: ILocationModal;
  loading: boolean;
}

const useStyles = makeStyles(() => ({
  bottom: {
    display: 'flex',
    alignItems: 'center',
  },
  action: {
    marginLeft: '20px',
  },
}));

const DashboardLocation: React.FC<IDashboardLocationProps> = ({
  location,
  loading,
}) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const dispatch = useDispatch();

  const styles = useStyles();

  const remove = () => {
    dispatch(locationActions.remove(location.id));
  };

  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <MULink gutterBottom variant="h5" component="h2">
          <Link href={`/dashboard/locations/${location.id}`}>
            {location.city}
          </Link>
        </MULink>
        <Typography variant="body2" color="textSecondary" component="p">
          {`${location.region}, ${location.country_code}, ${location.postal_code}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {location.address}
        </Typography>

        <div className={styles.bottom}>
          {confirm ? (
            <Button onClick={remove}>Are you sure</Button>
          ) : (
            <Button onClick={() => setConfirm(true)}>DELETE</Button>
          )}

          <Link href={`/dashboard/locations/${location.id}/edit`}>
            <a className={styles.action}>Edit</a>
          </Link>
        </div>
      </ProgressCardContent>
    </Card>
  );
};

export default DashboardLocation;
