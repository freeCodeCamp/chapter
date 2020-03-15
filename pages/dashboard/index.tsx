import React from 'react';
import Link from 'next/link';

import links from 'client/constants/DashboardLinks';

const Dashboard: React.FC = () => {
  return (
    <div>
      {links.map(item => (
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
