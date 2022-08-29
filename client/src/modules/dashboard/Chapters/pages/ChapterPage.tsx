import { Heading, Link, Box, HStack, Text } from '@chakra-ui/layout';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';
import { useConfirmDelete } from 'chakra-confirm';

import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { Button, useDisclosure, AlertDialog } from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
import { SettingAlertDialog } from '../../../../components/SettingAlert';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useChapterQuery,
  useDeleteChapterMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';
import { CHAPTERS } from '../../../chapters/graphql/queries';

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('id');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alertDialogFocusElement = useRef(null);
  const confirmDelete = useConfirmDelete();

  const [deleteChapter] = useDeleteChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  const router = useRouter();

  const clickDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.push('/dashboard/chapters');
  };

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
                <Heading
                  fontSize={'md'}
                  as="h1"
                  fontWeight="semibold"
                  marginBlock={'2'}
                >
                  {data.chapter.name}
                </Heading>
                <Box>
                  <Link
                    href={`${chapterId}/users`}
                    target="_blank"
                    paddingBlock={'2'}
                  >
                    Chapter Users
                  </Link>
                </Box>
                <HStack mt={'2'}>
                  <LinkButton
                    colorScheme={'blue'}
                    size="sm"
                    href={`${chapterId}/new-event`}
                  >
                    Add new event
                  </LinkButton>
                  <LinkButton
                    colorScheme={'blue'}
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
              <Heading as="h2" mb="4" fontSize={['lg', '2xl']}>
                Chapter Setting
              </Heading>
              <Button colorScheme="red" onClick={onOpen}>
                Delete Chapter
              </Button>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={alertDialogFocusElement}
                onClose={onClose}
              >
                <SettingAlertDialog
                  title="Delete Chapter"
                  DialogBody="For Deleting Chapter, Please type its name"
                  inputPlaceholder={data.chapter.name}
                >
                  <Button onClick={onClose} marginInline={'2em'}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={clickDelete}
                    type={'submit'}
                  >
                    Delete
                  </Button>
                </SettingAlertDialog>
              </AlertDialog>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
      <Text fontWeight={400} margin={2}>
        PlaceHolder for Events...
      </Text>
    </Layout>
  );
};
