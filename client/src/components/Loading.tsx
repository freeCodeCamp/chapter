import React from 'react';

import { Spinner } from '@chakra-ui/react';

type Props = {
  loading: boolean;
  error?: Error;
};

export const Loading = ({ loading, error }: Props) => {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  } else {
    return null;
  }
};
