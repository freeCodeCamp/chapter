import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { Logo } from './styles';

const MainHeader = () => {
  return (
    <AppBar position="relative" color="primary">
      <Toolbar>
        <Logo>Chapter</Logo>
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;
