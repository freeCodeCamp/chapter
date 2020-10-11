import React from 'react';
import Link from 'next/link';

const Skeleton: React.FC = ({ children }) => {
  return (
    <>
      <Link href="/dashboard/events">
        <a>Events</a>
      </Link>
      {children}
    </>
  );
};

export default Skeleton;
