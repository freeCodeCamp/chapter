import React from 'react';

import Header from './Header';
import usePageLayoutStyles from './pageLayout.styles';

const PageLayout: React.FC = ({ children }) => {
  const classes = usePageLayoutStyles();
  return (
    <>
      <Header classes={classes} />
      <div className={classes.pageRoot}>{children}</div>
    </>
  );
};
export default PageLayout;
