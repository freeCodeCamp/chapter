import React from 'react';
import { NextPage } from 'next';
import { useAuth } from 'modules/auth/store';

export const UserProfilePage: NextPage = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <div>Hello User</div>
      ) : (
        <div>Please login to see your profile</div>
      )}
    </div>
  );
};
