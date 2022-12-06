import { Box, Grid, Heading, ListItem, UnorderedList } from '@chakra-ui/layout';
import React from 'react';
import { LinkButton } from 'chakra-next-link';

export const Footer: React.FC = () => {
  return (
    <Grid
      marginTop="2em"
      backgroundColor={'gray.10'}
      paddingInline="2em"
      paddingBlock="1em"
      gap=".5em"
      gridTemplateColumns={{ base: 'none', lg: 'repeat(2, 1fr)' }}
      justifyItems={{ base: 'center', lg: 'flex-start' }}
      templateAreas={{
        base: `
          "chapterpolicy"
          "policy"
          "policylink"
          `,
        lg: `
          "chapterpolicy policyLink"
          "policy policy"
          `,
      }}
    >
      <Heading gridArea="chapterpolicy" as="h2">
        Chapter Policy
      </Heading>
      <UnorderedList gridArea="policy" marginInline="1.5em" spacing={1}>
        <ListItem>
          Chapter is designed to work with Google Calendar. It can automatically
          create calendars when you create new chapters and calendar events when
          you create new events in a chapter.
        </ListItem>
        <ListItem>
          You can delete your data at anytime and it will be removed from our
          database in your profile.
        </ListItem>
      </UnorderedList>
      {/* The layout need to have div wrapped around it to give desired looks
          This isn't normal, ToDo: find out why the need for div,
          and remove it for cleaner code
      */}
      <Box
        display="inline-grid"
        placeItems={{ base: 'flex-start', lg: 'center' }}
        width="100%"
      >
        <LinkButton
          gridArea="policyLink"
          href="/policy"
          fontWeight="600"
          background={'gray.85'}
          color={'gray.10'}
          height={'2.5em'}
          borderRadius={'5px'}
          _hover={{
            color: 'gray.85',
            backgroundColor: 'gray.10',
            borderColor: 'gray.85',
          }}
        >
          Know More
        </LinkButton>
      </Box>
    </Grid>
  );
};
