import { Heading, Grid, Image, Text, Tag, GridItem } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { Chapter } from 'generated/graphql';

type ChapterCardProps = {
  chapter: Pick<
    Chapter,
    'id' | 'name' | 'description' | 'category' | 'imageUrl'
  >;
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Grid
      data-cy="chapter-card"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Link href={`/chapters/${chapter.id}`} _hover={{}}>
        <Grid
          gridGap={1}
          w={'100vw'}
          maxW={'35em'}
          templateRows="repeat(2, 5em)"
          templateColumns="repeat(5, 5em)"
        >
          <GridItem colSpan={4} marginLeft={'0.5em'}>
            <Heading
              data-cy="chapter-heading"
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
              marginBlock="2"
              as="h3"
            >
              {chapter.name}
            </Heading>
            {/* <Text fontWeight="semibold" as="h4">{chapter.category}</Text> */}
            <Text color={'darkcyan'} fontWeight="bold" as="h4">
              In-Person
            </Text>
          </GridItem>

          <GridItem colSpan={2} rowStart={1} rowSpan={3} colStart={5}>
            <Image
              width={'100%'}
              height={'100%'}
              src={chapter.imageUrl}
              objectFit={'cover'}
              display="block"
            />
          </GridItem>
          <GridItem
            rowSpan={2}
            colSpan={2}
            rowStart={2}
            colStart={1}
            marginLeft={'0.5em'}
          >
            <Text mt="2" as="p">
              {chapter.description}
            </Text>
          </GridItem>
          <GridItem colSpan={3} colStart={1} rowStart={3}>
            <Tag
              marginInline={'.5rem'}
              marginBottom={'.5rem'}
              colorScheme={'messenger'}
            >
              Frontend Tag
            </Tag>
            <Tag
              marginInline={'.5rem'}
              marginBottom={'.5rem'}
              colorScheme={'messenger'}
            >
              Backend Tag
            </Tag>
          </GridItem>
        </Grid>
      </Link>
    </Grid>
  );
};
