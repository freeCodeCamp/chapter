import React from 'react';
import { NextPage } from 'next';
import { Flex, Heading, Text, Link } from '@chakra-ui/layout';
import { useAuth } from 'modules/auth/store';

export const UserProfilePage: NextPage = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            Profile
          </Heading>
          <Heading as="h2" size={'lg'}>
            Welcome {user.name}
          </Heading>
          {user.admined_chapters.length > 0 ? (
            <>
              <Heading as="h2" marginBlock={'.5em'} size="md">
                You are administering these Chapters
              </Heading>
              <Flex marginTop={'1em'} flexDirection={'column'} gap={4}>
                {user.admined_chapters.map(({ name, id }) => (
                  <>
                    <Link key={id}>
                      <Text>{name}</Text>
                    </Link>
                  </>
                ))}
              </Flex>
            </>
          ) : (
            ''
          )}
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
