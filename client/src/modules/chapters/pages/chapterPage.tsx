import { Heading, VStack, Spinner, Stack, Text, Image } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

import { EventCard } from 'components/EventCard';
import { useChapterQuery } from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const ChapterPage: NextPage = () => {
  const id = useParam('chapterId');

  const { loading, error, data } = useChapterQuery({
    variables: { id: id || -1 },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data?.chapter) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Image
          boxSize="100%"
          maxH="300px"
          src={data.chapter.imageUrl}
          alt=""
          borderRadius="md"
          objectFit="cover"
        />
        <Heading
          as="h1"
          lineHeight={1.1}
          fontWeight={600}
          color={'gray.700'}
          fontSize={{ base: 'xl', sm: '4xl', lg: '3xl' }}
        >
          <Text as={'span'} position={'relative'}>
            {data.chapter.name}
          </Text>
          <br />
        </Heading>
        <Text fontSize={'lg'} color={'gray.500'}>
          {data.chapter.description}
        </Text>
        <Heading size="md" color={'gray.700'}>
          Events:
        </Heading>
        {data.chapter.events.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              // Fix this | undefined
              chapter: { id, name: data.chapter?.name || '' },
            }}
          />
        ))}
      </Stack>
    </VStack>
  );
};
