import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, makeStyles } from '@material-ui/core';
import Link from 'next/link';

import ProgressCardContent from 'client/components/ProgressCardContent';
import { IVenueModal } from 'client/store/types/venues';
import getLocationString from 'client/helpers/getLocationString';
// import { venueActions } from 'client/store/actions';
// import useThunkDispatch from 'client/hooks/useThunkDispatch';

interface IVenueItemProps {
  venue: IVenueModal;
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

const VenueItem: React.FC<IVenueItemProps> = ({ venue, loading }) => {
  const [allow, setAllow] = useState<boolean>(false);
  // const dispatch = useThunkDispatch();

  const styles = useStyles();

  const remove = () => {
    const answer = confirm('Are you sure you want to delete this');
    if (answer) {
      // dispatch(venueActions.remove(venue.id));
      alert("You cant delete a venue right now, we'll add that feature later");
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
          href={`/dashboard/venues/[id]`}
          as={`/dashboard/venues/${venue.id}`}
        >
          <a>
            <h1>{venue.name}</h1>
          </a>
        </Link>
        {venue.location && (
          <Typography variant="body2" color="textSecondary" component="p">
            {getLocationString(venue.location, true)}
          </Typography>
        )}

        <div className={styles.bottom}>
          {allow ? (
            <Button onClick={remove}>Are you sure</Button>
          ) : (
            <Button onClick={() => setAllow(true)}>DELETE</Button>
          )}
          <Link
            href={`/dashboard/venues/[id]/edit`}
            as={`/dashboard/venues/${venue.id}/edit`}
          >
            <a className={styles.action}>Edit</a>
          </Link>
        </div>
      </ProgressCardContent>
    </Card>
  );
};

export default VenueItem;
