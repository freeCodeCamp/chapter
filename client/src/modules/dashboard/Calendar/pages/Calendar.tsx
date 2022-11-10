import React, { ReactElement } from 'react';
import { LinkButton } from 'chakra-next-link';
import { Heading } from '@chakra-ui/layout';
import { checkPermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { useAuth } from '../../../auth/store';
import { Layout } from '../../shared/components/Layout';
import { NextPageWithLayout } from '../../../../pages/_app';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const Calendar: NextPageWithLayout = () => {
  const { user } = useAuth();
  const canAuthenticateWithGoogle = checkPermission(
    user,
    Permission.GoogleAuthenticate,
  );
  return (
    <>
      {canAuthenticateWithGoogle ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            You can link your google calendar here
          </Heading>
          <LinkButton
            as="a"
            href={new URL('/authenticate-with-google', serverUrl).href}
            fontWeight="600"
            background={'gray.85'}
            color={'gray.10'}
            height={'100%'}
            marginLeft={'1em'}
            borderRadius={'5px'}
            paddingBlock={'.65em'}
            _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          >
            Authenticate with Google
          </LinkButton>
        </>
      ) : (
        <Heading as="h1">This is future a feature</Heading>
      )}
    </>
  );
};

Calendar.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
