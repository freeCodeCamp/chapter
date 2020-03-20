import React from 'react';
import Link from 'next/link';

import links from 'client/constants/DashboardLinks';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  link: {
    fontSize: '1rem',
    marginRight: '1rem',
  },
}));

const Navbar: React.FC = () => {
  const styles = useStyles();

  return (
    <nav>
      {links.map(item => (
        <Link href={item.link} key={item.text}>
          <a className={styles.link}>{item.text}</a>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
