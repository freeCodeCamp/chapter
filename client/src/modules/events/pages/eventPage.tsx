import React from 'react';
import { NextPage } from 'next';
import { useEventQuery } from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const EventPage: NextPage = () => {
  const id = useParam('eventId');

  const { loading, error, data } = useEventQuery({
    variables: { id: id || -1 },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.event) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>{data?.event.name}</h1>
    </div>
  );
};
