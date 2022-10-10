import React from 'react';

import styles from '../../../../styles/Page.module.css';

type Props =
  | {
      error?: Error;
      errors?: never;
    }
  | {
      error?: never;
      errors?: Error[];
    };

export const DashboardLoading = ({ error, errors }: Props) => {
  if (error || errors?.length) {
    return (
      <>
        <h1>{'Error...'}</h1>
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
  }
  return <h1>{'Loading...'}</h1>;
};
