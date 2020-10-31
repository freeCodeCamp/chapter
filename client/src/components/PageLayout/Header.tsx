declare let google: any; // For google 'one tap' api

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { makeStyles, Grid } from '@material-ui/core';

import { headerLinks, IHeaderLink } from '../../constants/Header';

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
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const runGoogleAuth = async (script: HTMLElement) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHAPTER_SERVER}/auth/is-authed`,
        {
          method: 'get',
          credentials: 'include',
        },
      );
      const responseBody = await response.json();
      const { isAuth } = responseBody;

      if (!isAuth) {
        document.body.appendChild(script);
      } else {
        setIsAuth(true);
      }
    };

    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const handleCredentialResponse = async (response: any) => {
        await fetch(
          `${process.env.NEXT_PUBLIC_CHAPTER_SERVER}/auth/google/token?access_token=${response.credential}`,
          {
            method: 'post',
            credentials: 'include',
          },
        );
        setIsAuth(true);
      };
      const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const callback = handleCredentialResponse;
      const auto_select = false;
      google.accounts.id.initialize({
        client_id,
        callback,
        auto_select,
      });
      google.accounts.id.prompt();
    };

    runGoogleAuth(script);
  }, [isAuth]);

  let links: IHeaderLink[];

  if (isAuth) {
    links = headerLinks.filter(
      link => link.name !== 'google' && link.name !== 'login',
    );
  } else {
    links = headerLinks.filter(link => link.name !== 'logout');
  }

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
          {links.map(headerLink => {
            if (headerLink.name === 'google' || headerLink.name === 'logout') {
              return (
                <Grid item key={headerLink.name}>
                  <a className={styles.link} href={headerLink.href}>
                    {headerLink.label}
                  </a>
                </Grid>
              );
            }

            return (
              <Grid item key={headerLink.name}>
                <Link href={headerLink.href}>
                  <a className={styles.link}>{headerLink.label}</a>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
