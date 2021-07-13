import React from 'react';
import { NextPage } from 'next';
import { useParam } from 'hooks/useParam';
import { useChapterQuery } from 'generated/graphql';
import { Heading, VStack, Stack, Text, Spinner, Image } from '@chakra-ui/react';
import { EventCard } from 'components/EventCard';

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
          src={data.chapter.image}
          alt="The freeCodeCamp logo"
          borderRadius="md"
          objectFit="cover"
        />
        <Heading
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
