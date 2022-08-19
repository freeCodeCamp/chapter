import { Flex, Heading, Link, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useSponsorQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const SponsorPage: NextPage = () => {
  const { param: sponsorId } = useParam('id');
  const { loading, error, data } = useSponsorQuery({
    variables: { sponsorId },
  });

  if (loading) {
    return <h1>Loading the sponsor details</h1>;
  }

  if (error) {
    return <h1>Error loading the sponsor details</h1>;
  }
  return (
    <Layout>
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading data-cy="name" as="h2" fontWeight="normal" mb="2">
            {data?.sponsor?.name}
          </Heading>
        </ProgressCardContent>
      </Card>

      <Card mt="4">
        <Heading as="h4" size="md" fontWeight="normal">
          Details{' '}
        </Heading>
        <Flex mt="2" justifyContent="space-between">
          <Text data-cy="type">Type: {data?.sponsor?.type}</Text>
          <Text data-cy="website">
            Website: <Link>{data?.sponsor?.website}</Link>
          </Text>
        </Flex>
      </Card>

      <h3>Placeholder for events ....</h3>
    </Layout>
  );
};
