declare let google: any; // For google api

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

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const handleCredentialResponse = (response: any) => {
        console.log(response);
      };
      const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID; // DOES NOT WORK. COPY FROM .env in client
      const callback = handleCredentialResponse;
      const auto_select = false;
      google.accounts.id.initialize({ client_id, callback, auto_select });
      google.accounts.id.prompt((notification: any) => {
        console.log(notification);
      });
    };

    document.body.appendChild(script);

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
