import React from 'react';
import { headerLinks } from '../../config';

const Header = ({ classes }) => (
  <header className={`${classes.pageRoot} ${classes.headerContainer}`}>
    <div>Search Bar here</div>
    <img src="/freecodecamp-logo.svg" alt="The freeCodeCamp logo" />
    <nav>
      <ul className={classes.navList}>
        {headerLinks.map(headerLink => (
          <li className={classes.navListItem} key={headerLink.name}>
            {headerLink.label}
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
export default Header;
