import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { LinkButton } from 'chakra-next-link';
import { Tag } from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useVenueLazyQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';

export const VenuePage: NextPage = () => {
  const { param: venueId, isReady } = useParam('id');

  const [getVenue, { loading, error, data }] = useVenueLazyQuery({
    variables: { id: venueId },
  });

  useEffect(() => {
    if (isReady) getVenue();
  }, [isReady]);

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;

  // TODO: render something nicer if this happens. A 404 page?
  if (!data.venue) return <div> Venue not found</div>;

  return (
    <Layout dataCy="view-venue-page">
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading as="h1" fontWeight="normal" mb="2">
            {data.venue.name}
          </Heading>

          <Text>{getLocationString(data.venue, true)}</Text>
          <Text>{data.venue.chapter.name}</Text>
        </ProgressCardContent>
      </Card>
      <Heading as={'h2'} marginBlock={'1em'} fontSize={'lg'}>
        Organized By The Venue&apos;s Chapter
      </Heading>
      <Grid gap={'2em'}>
        {data.venue.chapter.events.map(
          ({ name, canceled, invite_only, id }) => (
            <GridItem key={id}>
              <Flex justifyContent={'space-between'}>
                <LinkButton href={`/events/${id}`}>{name}</LinkButton>
                <Flex>
                  {canceled && (
                    <Tag
                      borderRadius="lg"
                      marginRight={'3'}
                      paddingInline="[1 , 2]"
                      paddingBlock="[.5, 1]"
                      fontSize={['small', 'md']}
                      maxWidth={'8em'}
                      mt="1"
                      maxH={'2em'}
                      colorScheme={'red'}
                    >
                      Canceled
                    </Tag>
                  )}
                  {invite_only && (
                    <Tag
                      borderRadius="lg"
                      mt="1"
                      paddingInline="[1 , 2]"
                      paddingBlock="[.5, 1]"
                      colorScheme={'blue'}
                      fontSize={['small', 'md']}
                      maxWidth={'8em'}
                      maxH={'2em'}
                    >
                      Invite only
                    </Tag>
                  )}
                </Flex>
              </Flex>
            </GridItem>
          ),
        )}
      </Grid>
    </Layout>
  );
};
