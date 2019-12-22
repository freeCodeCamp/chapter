import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, InputBase, Grid, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { styles, resolved } from './styles';

const Navbar: React.FC = () => {
  // <header className={`${classes.pageRoot} ${classes.headerContainer}`}>
  //   {props.action && <div className={styles}>props.action</div>}
  //   {props.brand && <span className={styles}>props.brand</span>}
  //   <nav>
  //     <ul className={classes.navList}>
  //       {mapToElements(props.links)}
  //     </ul>
  //   </nav>
  // </header>
  return (
    <AppBar position="static" className={resolved.className}>
      <Toolbar className={`${resolved.className} nav-toolbar`}>
        <div className="nav-brand">
          <Link href="/">
            <img className="brand" src="/images/logo.png" alt="FreeCodeCamp" />
          </Link>
        </div>
        <div className="search-bar">
          <div className="search-icon-wrapper">
            <Search />
          </div>
          <InputBase
            className={`${resolved.className} search-input`}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <Grid
          container
          item
          xs={12}
          className={`${resolved.className} nav-menus`}
          spacing={0}
        >
          <Button color="inherit">Events</Button>
          <Button color="inherit">Chapters</Button>
          <Button color="inherit">Login</Button>
        </Grid>
      </Toolbar>
      <style jsx>{styles}</style>
      {resolved.styles}
    </AppBar>
  );
};

export default Navbar;
