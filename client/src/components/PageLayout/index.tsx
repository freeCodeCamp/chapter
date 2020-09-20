import React from 'react';

import Header from './Header';
import usePageLayoutStyles from './pageLayout.styles';

const PageLayout: React.FC = ({ children }) => {
  const classes = usePageLayoutStyles();
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID} //"964378614272-befvmf2sbilbfon1in9jta1vv4tc81rr.apps.googleusercontent.com"
        data-login_uri={process.env.REACT_APP_LOGIN_URI} //"http://localhost:5000/auth/login"
      />
      <Header classes={classes} />
      <div className={classes.pageRoot}>{children}</div>
    </>
  );
};
export default PageLayout;
