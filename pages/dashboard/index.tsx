import React from 'react';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Link href="/dashboard/events">
        <a>Events</a>
      </Link>
      <br />
      <Link href="/dashboard/locations">
        <a>Locations</a>
      </Link>
    </div>
  );
};

export default Dashboard;
