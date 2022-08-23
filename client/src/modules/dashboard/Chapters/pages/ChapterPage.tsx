import { Heading, Link, Box, HStack } from '@chakra-ui/layout';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';

import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { Button, useDisclosure, AlertDialog } from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
import { SettingAlertDialog } from '../../../../components/SettingAlert';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('id');
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                  <LinkButton size="sm" href={`${chapterId}/new-event`}>
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
              <Button colorScheme="red" onClick={onOpen}>
                Transfer Ownership
              </Button>
              <AlertDialog isOpen={isOpen} leastDestructiveRef={useRef()}>
                <SettingAlertDialog
                  title="Transfer Ownership"
                  DialogBody="PLease Type Chapter name to transfer its ownership"
                  inputPlaceholder="Chapter_Name"
                >
                  <Button ref={useRef()} onClick={onClose} mr={3}>
                    Cancel
                  </Button>
                  <Button colorScheme="red">Transfer</Button>
                </SettingAlertDialog>
              </AlertDialog>

              <Button colorScheme="red" onClick={onOpen}>
                Delete Chapter
              </Button>
              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef}>
                <SettingAlertDialog
                  title="Delete Chapter"
                  DialogBody="For Deleting Chapter, Please type its name"
                  inputPlaceholder="Chapter_Name"
                >
                  <Button colorScheme="red">Delete</Button>
                </SettingAlertDialog>
              </AlertDialog>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
