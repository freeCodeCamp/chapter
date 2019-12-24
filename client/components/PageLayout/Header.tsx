import Grid from '@material-ui/core/Grid';
import React from 'react';
import { headerLinks } from '../../config';

const Header = ({ classes }) => (
  <Grid
    className={`${classes.pageRoot} ${classes.headerContainer}`}
    container
    component="header"
    alignItems="center"
  >
    <Grid item xs={12} md={4}>
      Search Bar here
    </Grid>
    <Grid
      item
      component="img"
      src="/freecodecamp-logo.svg"
      alt="The freeCodeCamp logo"
      xs={12}
      md={4}
    />
    <Grid component="nav" item xs={12} md={4}>
      <Grid container direction="row" spacing={2} justify="center">
        {headerLinks.map(headerLink => (
          <Grid item key={headerLink.name}>
            {headerLink.label}
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
);
export default Header;
