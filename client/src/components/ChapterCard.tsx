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
    <Grid data-cy="chapter-card" boxShadow="md">
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
              fontWeight={500}
              fontFamily={'body'}
              color={'darkblue'}
            >
              {chapter.name}
            </Heading>
            <Text color={'darkblue'}>{chapter.category}</Text>
          </GridItem>

          <GridItem
            colSpan={2}
            rowStart={1}
            rowSpan={1}
            colStart={5}
            marginRight={'0.5em'}
            marginTop={'0.5em'}
          >
            <Image
              boxSize={'150px'}
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
            <Text color={'Darkblue'}>{chapter.description}</Text>
          </GridItem>
          <GridItem colSpan={3} colStart={1} rowStart={3}>
            <Tag marginInline={'.5rem'} marginBottom={'.5rem'}>
              Frontend Tag
            </Tag>
            <Tag marginInline={'.5rem'} marginBottom={'.5rem'}>
              Backend Tag
            </Tag>
          </GridItem>
        </Grid>
      </Link>
    </Grid>
  );
};
