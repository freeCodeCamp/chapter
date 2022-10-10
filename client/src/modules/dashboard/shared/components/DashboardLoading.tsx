import React from 'react';

import styles from '../../../../styles/Page.module.css';

type Props =
  | {
      loading: boolean;
      error?: Error;
      errors?: never;
    }
  | {
      loading: boolean;
      error?: never;
      errors?: Error[];
    }
  | {
      loading: boolean;
      error?: never;
      errors?: never;
    };

export const DashboardLoading = ({ loading, error, errors }: Props) => {
  if (loading || error) {
    return (
      <>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && (
          <div className={styles.error} data-cy="loading-error">
            {error.message}
          </div>
        )}
        {errors?.map(({ message }) => (
          <div key={message} className={styles.error} data-cy="loading-error">
            {message}
          </div>
        ))}
      </>
    );
  } else {
    return null;
  }
};
