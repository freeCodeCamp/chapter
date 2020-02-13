import React from 'react';
import { useRouter } from 'next/router';

const Event: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>You&apos;re on event: {id}</h1>;
};

export default Event;
