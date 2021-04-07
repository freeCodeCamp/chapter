import React from 'react';
import Link from 'next/link';
import { makeStyles, Grid } from '@material-ui/core';

import { headerLinks } from '../../constants/Header';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  searchBox: {
    backgroundColor: 'white',
  },
});

const Header: React.FC<{ classes: Record<string, any> }> = ({ classes }) => {
  const styles = useStyles();

  return (
    <Grid
      className={`${classes.pageRoot} ${classes.headerContainer}`}
      container
      component="header"
      alignItems="center"
      spacing={2}
      style={{
        margin: 0,
        width: '100%',
      }}
    >
      <Link href="/">
        <Grid
          item
          component="img"
          className={styles.cursorPointer}
          src="/freecodecamp-logo.svg"
          alt="The freeCodeCamp logo"
          xs={12}
          md={4}
        />
      </Link>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          className={styles.searchBox}
          placeholder="Enter your city, state or country to search for events"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ color: '#a0a0a0' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid component="nav" item xs={12} md={4}>
        <Grid container direction="row" spacing={2} justify="center">
          {headerLinks.map(headerLink => (
            <Grid item key={headerLink.name}>
              <Link href={headerLink.href}>
                <a className={styles.link}>{headerLink.label}</a>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
