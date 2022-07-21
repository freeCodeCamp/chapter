import { Heading, Link, Box, HStack } from '@chakra-ui/layout';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';

import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
// uncomment the dialog tomorrow, I am going auto pilot without thinking
import { SettingAlertDialog } from '../../../../components/SettingAlert';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const router = useRouter();
  const chapterId = getId(router.query) || -1;

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
              <SettingAlertDialog
                title="hello"
                DialogBody="Sboon Created something"
                refFunction={useRef}
                inputPlaceholder="Sboon was here"
              >
                <Button>Hello</Button>
              </SettingAlertDialog>
              <SettingAlertDialog
                title="hello"
                DialogBody="Sboon Created something"
                refFunction={useRef}
                inputPlaceholder="Sboon was here"
              >
                <Button>Hello</Button>
              </SettingAlertDialog>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
