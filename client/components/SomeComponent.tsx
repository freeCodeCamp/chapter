import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

// Use styled components only if you want to create custom components
// not readily available with Material UI or if you want to customize
// Material UI components with more than just the available MUI API

const StyledGrid = styled(Grid)`
  background: ${({
    theme: {
      palette: { background },
    },
  }) => background.default};
  color: ${({
    theme: {
      palette: { secondary },
    },
  }) => secondary.main};
`;

const SomeComponent = () => {
  return (
    <Grid container>
      <StyledGrid item xs={12}>
        This is an imported component with a Button
      </StyledGrid>
      <Button variant="outlined">CLick Here!</Button>
    </Grid>
  );
};

export default withTheme(SomeComponent);
