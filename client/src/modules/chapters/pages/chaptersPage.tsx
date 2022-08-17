import { Heading, VStack, Stack, Flex, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useChaptersQuery } from 'generated/graphql';

export const ChaptersPage: NextPage = () => {
  const { loading, error, data } = useChaptersQuery();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.chapters) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }
  return (
    <VStack>
      <Stack w="40%" mt={10} mb={5}>
        <Flex justify="start">
          <Heading>Chapters: </Heading>
        </Flex>
        <Flex direction="column">
          <Text fontSize="2xl">
            {' '}
            Chapters allow you to organize events based on your preferences.
          </Text>
          <Grid mt="5%" templateColumns="repeat(2, 1fr)" columnGap="5%">
            <GridItem>
              <TableContainer>
                <Table colorScheme="facebook" borderRadius="md" borderWidth={2}>
                  <Thead>
                    <Tr bg="blue.200">
                      <Th borderWidth={2}>Chapter</Th>
                      <Th borderWidth={2}>Description</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.chapters.map((chapter) => (
                      <Tr key={chapter.id}>
                        <Td borderWidth={2}>{chapter.name}</Td>
                        <Td borderWidth={2}>{chapter.description}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </GridItem>

            <GridItem>
              <TableContainer>
                <Table colorScheme="facebook" borderRadius="md" borderWidth={2}>
                  <Thead>
                    <Tr bg="blue.200">
                      <Th borderWidth={2}>Chapter</Th>
                      <Th borderWidth={2}>Description</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.chapters.map((chapter) => (
                      <Tr key={chapter.id}>
                        <Td borderWidth={2}>{chapter.name}</Td>
                        <Td borderWidth={2}>{chapter.description}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </GridItem>
          </Grid>
        </Flex>
      </Stack>
    </VStack>
  );
};
