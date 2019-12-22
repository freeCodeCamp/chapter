import React from 'react';
import { Button as MButton } from '@material-ui/core';

/**
 * This component resembles Material-UI at the moment, as Designs are quite similar to it,
 * But keeping this as a separate Component provides us flexibility to change the UI all
 * over the codebase, without worrying about where it is getting used.
 *
 * TODO: add more flexibility with props.
 */
const Button: React.FC = props => {
  return (
    <MButton variant="contained" color="primary" disableElevation>
      {props.children}
    </MButton>
  );
};

export default Button;
