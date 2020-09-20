/* global gapi */
import React, { useEffect } from 'react';
import Link from 'next/link';
import { makeStyles, Grid } from '@material-ui/core';

import { headerLinks } from '../../constants/Header';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
});

const Header: React.FC<{ classes: Record<string, any> }> = ({ classes }) => {
  const styles = useStyles();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://apis.google.com/js/platform.js?onload=init';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    script.onload = () => {
      console.log('gapi ', gapi);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Grid
      className={`${classes.pageRoot} ${classes.headerContainer}`}
      container
      component="header"
      alignItems="center"
    >
      <Grid item xs={12} md={4}>
        Search Bar here
      </Grid>
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
