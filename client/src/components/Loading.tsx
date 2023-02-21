import React from 'react';

import { Spinner } from '@chakra-ui/react';

type Props = {
  error?: Error;
};

export const Loading = ({ error }: Props) => {
  if (error) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }
  return <Spinner />;
};
