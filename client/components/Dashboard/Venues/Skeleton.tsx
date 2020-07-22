import React from 'react';
import Link from 'next/link';

const Skeleton: React.FC = ({ children }) => {
  return (
    <>
      <Link href="/dashboard/venues">
        <a>Venues</a>
      </Link>
      {children}
    </>
  );
};

export default Skeleton;
