import React from 'react';
import Link from 'next/link';

const items: { text: string; link: string }[] = [
  { text: 'Public', link: '/' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Locations', link: '/dashboard/locations' },
  { text: 'Venues', link: '/dashboard/venues' },
];

const Dashboard: React.FC = () => {
  return (
    <div>
      {items.map(item => (
        <>
          <Link href={item.link} key={item.text}>
            <a>{item.text}</a>
          </Link>
          <br />
        </>
      ))}
    </div>
  );
};

export default Dashboard;
