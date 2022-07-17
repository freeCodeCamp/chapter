import { Heading, Link, Box, HStack } from '@chakra-ui/layout';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';

import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const router = useRouter();
  const chapterId = getId(router.query) || -1;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  if (loading || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className={styles.card}>
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            <Tab>Setting</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProgressCardContent loading={loading}>
                <Heading as="h5" fontWeight="normal">
                  {data.chapter.name}
                </Heading>
                <Box>
                  <Link href={`${chapterId}/users`} target="_blank">
                    Chapter Users
                  </Link>
                </Box>
                <HStack>
            <LinkButton size="sm" href={`${chapterId}/new_event`}>
              Add new event
            </LinkButton>
            <LinkButton
              data-cy="create-venue"
              size="sm"
              href={`${chapterId}/new-venue`}
            >
              Add new venue
            </LinkButton>
          </HStack>
              </ProgressCardContent>
            </TabPanel>
            <TabPanel>
              {/* need to create popup for them */}
              <Button colorScheme="red" onClick={onOpen}>
                Transfer Chapter Ownership
              </Button>
              <Button colorScheme="red" ml={4}>
                Delete Chapter
              </Button>
            </TabPanel>
            {/* add leastDestructiveRef to cansel button to guide focus */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Transfer Ownership
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You cannot undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={onClose} ml={3}>
                      Conform Transfer Ownership
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </TabPanels>
        </Tabs>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
