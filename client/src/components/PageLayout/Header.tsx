import React from 'react';
import Link from 'next/link';
import { makeStyles, Grid } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import { headerLinks } from '../../constants/Header';
import theme from '../../styles/theme';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  // c.f. https://material-ui.com/components/app-bar/#app-bar-with-search-field
  inputInput: {
    width: '100%',
    color: theme.palette.secondary.main,
  },
  inputRoot: {
    color: 'inherit',
    width: '90%',
    fontSize: '0.83rem',
  },
  search: {
    position: 'relative',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    margin: '0.5rem 0',
  },
  searchIcon: {
    height: '100%',
    color: theme.palette.secondary.main,
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
        <div className={styles.search}>
          <div className={styles.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Enter your city, state or country to search for events"
            classes={{
              root: styles.inputRoot,
              input: styles.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
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
