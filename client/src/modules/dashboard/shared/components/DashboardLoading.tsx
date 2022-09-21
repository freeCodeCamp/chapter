import React from 'react';

import styles from '../../../../styles/Page.module.css';
import { Layout } from './Layout';

type Props = {
  loading: boolean;
  error?: Error;
};

export const DashboardLoading = ({ loading, error }: Props) => {
  if (loading || error) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && (
          <div className={styles.error} data-cy="loading-error">
            {error.message}
          </div>
        )}
      </Layout>
    );
  } else {
    return null;
  }
};
