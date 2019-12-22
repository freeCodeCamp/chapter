import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const Header: React.FC = () => {
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
    <AppBar position="static">
      <Toolbar>
        <div className="">
          <Link href="/">
            <img src="/images/logo.png" alt="FreeCodeCamp" />
          </Link>
        </div>
        <div className="">
          <div className="">
            <Search />
          </div>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
