import { Heading, Grid, Text } from '@chakra-ui/react';
import NextError from 'next/error';
import React, { ReactElement } from 'react';

import { Card } from '../../../../components/Card';
import { TagsBox } from '../../../../components/TagsBox';
import { useDashboardChapterQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { NextPageWithLayout } from '../../../../pages/_app';
import { Actions } from '../components/Actions';

export const ChapterPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');

  const { loading, error, data } = useDashboardChapterQuery({
    variables: { chapterId },
  });

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardChapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  const fields = [
    { value: data.dashboardChapter.description, label: 'Description' },
    { value: data.dashboardChapter.city, label: 'City' },
    { value: data.dashboardChapter.region, label: 'Region' },
    { value: data.dashboardChapter.country, label: 'Country' },
    { value: data.dashboardChapter.category, label: 'Category' },
    { value: data.dashboardChapter.banner_url, label: 'Banner' },
    { value: data.dashboardChapter.logo_url, label: 'Logo' },
    { value: data.dashboardChapter.chat_url, label: 'Chat' },
  ];

  const textStyle = { fontSize: { base: 'md', md: 'lg' }, fontWeight: 'bold' };
  return (
    <>
      <Card className={styles.card}>
        <Grid gap="1rem">
          <Heading
            fontSize={{ base: 'xl', md: 'xx-large' }}
            as="h1"
            fontWeight={{ base: 'bold', md: 'semi-bold' }}
            marginBlock={'1'}
          >
            Chapter: {data.dashboardChapter.name}
          </Heading>
          {!!data.dashboardChapter.chapter_tags.length && (
            <TagsBox tags={data.dashboardChapter.chapter_tags} />
          )}
          {fields.map(
            ({ value, label }) =>
              value && (
                <Text {...textStyle} key={label}>
                  {label}: {value}
                </Text>
              ),
          )}
          <Actions chapter={data.dashboardChapter} />
        </Grid>
      </Card>
      <EventList
        title="Organized Events"
        events={data.dashboardChapter.events}
      />
    </>
  );
};

ChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
