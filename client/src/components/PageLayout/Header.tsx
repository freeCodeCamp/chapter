import React from 'react';
import Link from 'next/link';
import { makeStyles, Grid } from '@material-ui/core';
import usePageLayoutStyles from './pageLayout.styles';

import { headerLinks } from '../../constants/Header';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  logo: {
    cursor: 'pointer',
    maxWidth: '300px',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      margin: 0,
    },
  },
  searchBox: {
    backgroundColor: 'white',
  },
  nav: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'fit-content',
    },
  },
  navCompatible: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '-moz-fit-content',
    },
  },
  links: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));

const Header: React.FC = () => {
  const styles = useStyles();
  const classes = usePageLayoutStyles();

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
          className={styles.logo}
          src="/freecodecamp-logo.svg"
          alt="The freeCodeCamp logo"
          xs={12}
          sm={6}
          md={4}
        />
      </Link>
      <Grid item xs={12} sm={6} md={4}>
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
      <Grid
        className={`${styles.nav} ${styles.navCompatible}`}
        component="nav"
        item
        xs={12}
        sm={6}
        md={4}
      >
        <Grid
          className={styles.links}
          container
          direction="row"
          spacing={2}
          justify="center"
        >
          {headerLinks.map((headerLink) => (
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
