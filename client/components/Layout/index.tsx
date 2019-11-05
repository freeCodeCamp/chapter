import React from 'react';
import { StyledLayout, StyledMain } from './styles';
import MainHeader from '../MainHeader';
import MainFooter from '../MainFooter';

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <StyledLayout>
      <MainHeader />
      <StyledMain>{children}</StyledMain>
      <MainFooter />
    </StyledLayout>
  );
};

export default Layout;
