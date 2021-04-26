import React, { useState, useEffect } from 'react';
import { Button, Card, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';

import { Venue } from '../../../../generated/graphql';
import { ProgressCardContent } from '../../../../components';
import getLocationString from '../../../../helpers/getLocationString';

interface VenueItemProps {
  venue: Omit<Omit<Omit<Venue, 'events'>, 'created_at'>, 'updated_at'>;
  loading: boolean;
}

const useStyles = makeStyles(() => ({
  bottom: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const VenueItem: React.FC<VenueItemProps> = ({ venue, loading }) => {
  const [allow, setAllow] = useState<boolean>(false);
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
        <Typography variant="body2" color="textSecondary" component="p">
          {getLocationString(venue, true)}
        </Typography>

        <div className={styles.bottom}>
          {allow ? (
            <Button onClick={remove} variant="outlined">
              Are you sure
            </Button>
          ) : (
            <Button onClick={() => setAllow(true)} variant="outlined">
              DELETE
            </Button>
          )}
          <Link
            href={`/dashboard/venues/[id]/edit`}
            as={`/dashboard/venues/${venue.id}/edit`}
          >
            <Button variant="outlined">
              <a>Edit</a>
            </Button>
          </Link>
        </div>
      </ProgressCardContent>
    </Card>
  );
};

export default VenueItem;
