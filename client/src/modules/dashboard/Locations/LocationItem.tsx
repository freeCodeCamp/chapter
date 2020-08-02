import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, makeStyles } from '@material-ui/core';
import Link from 'next/link';

import ProgressCardContent from 'client/components/ProgressCardContent';
import { ILocationModal } from 'client/store/types/locations';
// import { locationActions } from 'client/store/actions';
// import useThunkDispatch from 'client/hooks/useThunkDispatch';

interface ILocationItemProps {
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

const LocationItem: React.FC<ILocationItemProps> = ({ location, loading }) => {
  const [allow, setAllow] = useState<boolean>(false);
  // const dispatch = useThunkDispatch();

  const styles = useStyles();

  const remove = () => {
    const answer = confirm('Are you sure you want to delete this');
    if (answer) {
      // dispatch(locationActions.remove(location.id));
      alert(
        "You cant delete a location right now, we'll add that feature later",
      );
    } else {
      setAllow(false);
    }
  };

  useEffect(() => {
    if (allow) {
      setTimeout(() => {
        setAllow(false);
      }, 2000);
    }
  }, [allow]);

  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <Link
          href={`/dashboard/locations/[id]`}
          as={`/dashboard/locations/${location.id}`}
        >
          <a>
            <h1>{location.city}</h1>
          </a>
        </Link>
        <Typography variant="body2" color="textSecondary" component="p">
          {`${location.region}, ${location.country_code}, ${location.postal_code}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {location.address}
        </Typography>

        <div className={styles.bottom}>
          {allow ? (
            <Button onClick={remove}>Are you sure</Button>
          ) : (
            <Button onClick={() => setAllow(true)}>DELETE</Button>
          )}
          <Link
            href={`/dashboard/locations/[id]/edit`}
            as={`/dashboard/locations/${location.id}/edit`}
          >
            <a className={styles.action}>Edit</a>
          </Link>
        </div>
      </ProgressCardContent>
    </Card>
  );
};

export default LocationItem;
