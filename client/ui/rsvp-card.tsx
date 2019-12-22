import React from 'react';
import { Paper, Typography } from '@material-ui/core';

export interface IRsvpProps {
  title: string;
}

const RsvpCard: React.FC<IRsvpProps> = props => {
  return (
    <Paper className="rsvp-card">
      <Typography variant="h3" component="h3">
        {props.title}
      </Typography>
      <style jsx>{`
        .rsvp-card {
          padding: 15px;
        }
      `}</style>
    </Paper>
  );
};

export default RsvpCard;
