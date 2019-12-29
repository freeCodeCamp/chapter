import React from 'react';
import { Button as MButton, ButtonProps } from '@material-ui/core';
import { GoogleIcon } from 'client/icons';

/**
 * This component resembles Material-UI at the moment, as Designs are quite similar to it,
 * But keeping this as a separate Component provides us flexibility to change the UI all
 * over the codebase, without worrying about where it is getting used.
 *
 * TODO: add more flexibility with props.
 */
const Button: React.FC<ButtonProps> = props => {
  return (
    <MButton
      variant="outlined"
      startIcon={<GoogleIcon size="100%" />}
      disableElevation
    >
      {props.children}
    </MButton>
  );
};

export default Button;
