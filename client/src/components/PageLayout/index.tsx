import React from 'react';

import usePageLayoutStyles from './pageLayout.styles';
import { Header } from './Header';

const PageLayout: React.FC = ({ children }) => {
  const classes = usePageLayoutStyles();
  return (
    <>
      <Header />
      <div className={classes.pageRoot}>{children}</div>
    </>
  );
};
export default PageLayout;
