import React from 'react';
import { useRouter } from 'next/router';
import { Skeleton } from 'client/components/Dashboard/Events';

const Event: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Skeleton>
      <h1>You&apos;re on event: {id}</h1>
    </Skeleton>
  );
};

export default Event;
