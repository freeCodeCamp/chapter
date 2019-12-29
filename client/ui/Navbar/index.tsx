import React, { FC } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, InputBase, Grid, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { styles, resolved } from './styles';

export interface INavLinks {
  name: string;
  label: string;
  href: string;
}

export interface INavbarProps {
  links: INavLinks[];
}

const mapToMenuLinks = (links: INavLinks[]) => {
  return links.map(link => (
    <Link href={link.href} key={link.name}>
      <Button color="inherit">{link.label}</Button>
    </Link>
  ));
};

export const Navbar: FC<INavbarProps> = props => {
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
          {mapToMenuLinks(props.links)}
        </Grid>
      </Toolbar>
      <style jsx>{styles}</style>
      {resolved.styles}
    </AppBar>
  );
};

Navbar.defaultProps = {
  links: [],
};

export default Navbar;
