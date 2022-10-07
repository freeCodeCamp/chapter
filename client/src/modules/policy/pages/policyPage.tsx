import React from 'react';
import { NextPage } from 'next';
import { Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useAuthStore } from 'modules/auth/store';

export const PolicyPage: NextPage = () => {
  const {
    data: { loadingUser },
  } = useAuthStore();
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  return (
    <Flex flexDirection={'column'} gap={'1em'}>
      <Heading as={'h1'}>
        We take your privacy seriously. And we give you full control over your
        data.
      </Heading>

      {loadingUser ? (
        <Spinner color="white" size="xl" />
      ) : (
        <Flex
          gap={'1'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexDirection={['column', 'row']}
        >
          <Text
            as={'p'}
            maxW={['100%', '50%']}
            fontWeight={'500'}
            fontSize="lg"
          >
            You can link your Account to Google calander but before you do
            please finish reading the policy, you can always do it later in your
            Profile
          </Text>
          <Button
            as="a"
            href={new URL('/authenticate-with-google', serverUrl).href}
            fontWeight="600"
            background={'gray.85'}
            color={'gray.10'}
            height={'100%'}
            borderRadius={'5px'}
            paddingBlock={'.65em'}
            _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          >
            Authenticate with Google
          </Button>
        </Flex>
      )}

      <Heading as={'h2'}>Does Chapter collect anonymous data?</Heading>
      <Text>
        When you use the Chapter website, we may collect some anonymous data so
        we can understand how people are using Chapter, and basic facts like
        which browser they&apos;re using.
      </Text>

      <Heading as={'h2'}>
        In what situations does Chapter collect personal data?
      </Heading>
      <Text>
        If you create a Chapter account, we will collect some personal data so
        we can follow your progress toward earning developer certifications, and
        so you can customize your developer portfolio.
      </Text>

      <Heading as={'h2'}>Can I use Chapter anonymously?</Heading>
      <Text>
        Yes. You can access all of Chapter&apos;s events and interactive Chapter
        without creating an account. And if you don&apos;t create an account, we
        won&apos;t collect any personal data about you.
      </Text>

      <Heading as={'h2'}>
        If I create an account, what data will you collect?
      </Heading>
      <Text>
        We&apos;ll ask you for your email address so you can use it to sign into
        Chapter, and so we can provide...
      </Text>

      <Text>
        When you create an account on Chapter, we publish a organizer portfolio
        page for you on Chapter. If you want, you can add details about
        yourself, like your name, geographic location, and a link to your
        personal website.
      </Text>

      <Text>
        By default, your organizer portfolio will show which Chapter event you
        have organized.
      </Text>

      <Text>
        You have full control over your data, and can set any of these details
        to private, or delete them at any time.
      </Text>

      <Heading as={'h2'}>What is Chapter&apos;s Donor Privacy Policy?</Heading>
      <Text>
        Chapter will not share our donors&apos; names or personal information
        with anyone outside of our nonprofit organization&apos;s team. Donors
        may choose to display that they are donating to Chapter on their Chapter
        profile. Otherwise, donor information will only be used to process
        donations and send email confirmations. This policy applies to any
        written, verbal, or electronic communication.
      </Text>

      <Heading as={'h2'}>Can any other organizations access my data?</Heading>
      <Text>
        We don&apos;t sell your data to anyone. In order to provide service to
        you, your data does pass through some other services. All of these
        companies are based in the United States.
      </Text>

      <Text>
        We use Auth0 to sign you into Chapter. You can read the privacy policy
        for Auth0 online.
      </Text>

      <Text>
        We use Google Analytics to help us understand the demographics of our
        community and how people are using Chapter. You can opt out of Google
        Analytics on Chapter by installing this browser plugin. You can read the
        privacy policy for Google Analytics online. We also show Google ads in
        some parts of the Chapter website.
      </Text>

      <Text>
        That&apos;s all, folks. Know your privacy rights, and stay safe out
        there!
      </Text>
    </Flex>
  );
};
