import React from 'react';
import { Paper, Typography } from '@material-ui/core';

import { styles, resolved } from './styles';

export interface IRsvpProps {
  /**
   * Value to display `title`
   *
   * @default ""
   **/
  title: string;
}

// For now docgen is not working: https://github.com/storybookjs/storybook/issues/7829
// this is required for docgen information
// to be generated correctly. Even though this export will never be used
export const RsvpCard: React.FC<IRsvpProps> = props => {
  return (
    <Paper className={`${resolved.className} rsvp-card`}>
      <Typography variant="h4" component="h2">
        {props.title}
      </Typography>
      <style jsx>{styles}</style>
      {resolved.styles}
    </Paper>
  );
};

export default RsvpCard;
