import React from 'react';
import { Heading, Tag, Text, VStack } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { Chapter } from 'generated/graphql';

import { Card } from './Card';
import { truncate } from '../helpers/truncate';

type ChapterCardProps = {
  chapter: Pick<
    Chapter,
    'id' | 'name' | 'description' | 'category' | 'details'
  >;
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Card w="full">
      <VStack align="flex-start">
        <Heading size="md" as="h2">
          <Link href={`/chapters/${chapter.id}`}>{chapter.name}</Link>
        </Heading>
        <Text>{truncate(chapter.description, 120)}</Text>
        <Tag>{chapter.category}</Tag>

        {/* <Text>{truncate(chapter.details, 120)}</Text> */}
      </VStack>
    </Card>
  );
};
