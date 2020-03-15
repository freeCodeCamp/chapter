import React from 'react';
import Link from 'next/link';

const Skeleton: React.FC = ({ children }) => {
  return (
    <>
      <Link href="/dashboard/locations">
        <a>Locations</a>
      </Link>
      {children}
    </>
  );
};

export default Skeleton;
