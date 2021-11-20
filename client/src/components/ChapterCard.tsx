import {
  Stack,
  Heading,
  Box,
  Center,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
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
    <Center m={2} data-cy="chapter-card">
      <Link href={`/chapters/${chapter.id}`} _hover={{}}>
        <Box
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          rounded={'md'}
          overflow={'hidden'}
        >
          <Image
            h={'168px'}
            w={'full'}
            src={chapter.imageUrl}
            objectFit={'cover'}
          />
          <Box>
            <Stack spacing={0} align={'center'} mb={5} mt={-20}>
              <Heading
                data-cy="chapter-heading"
                fontSize={'xl'}
                fontWeight={500}
                fontFamily={'body'}
                color={'white'}
                textShadow={'1px 1px #000'}
              >
                {chapter.name}
              </Heading>
              <Text color={'white'} textShadow={'1px 1px #000'}>
                {chapter.category}
              </Text>
            </Stack>
          </Box>
        </Box>
      </Link>
    </Center>
  );
};
