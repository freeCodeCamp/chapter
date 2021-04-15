import React from 'react';
import Link from 'next/link';
import { Grid, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import links from '../../../../constants/DashboardLinks';

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
      <Grid container spacing={2}>
        {links.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.text}>
            <Link href={item.link}>
              <Button variant="outlined">
                <a className={styles.link}>{item.text}</a>
              </Button>
            </Link>
          </Grid>
        ))}
      </Grid>
    </nav>
  );
};

export default Navbar;
