import React from 'react';

const Header = ({ classes }) => (
  <header className={`${classes.pageRoot} ${classes.headerContainer}`}>
    <div>Search Bar here</div>
    <img src="/freecodecamp-logo.svg" alt="The freeCodeCamp logo" />
    <nav>
      <ul className={classes.navList}>
        <li className={classes.navListItem}>Events</li>
        <li className={classes.navListItem}>Chapters</li>
        <li className={classes.navListItem}>Login</li>
        <li className={classes.navListItem}>Register</li>
      </ul>
    </nav>
  </header>
);
export default Header;
