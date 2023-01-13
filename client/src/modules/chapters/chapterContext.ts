import { createContext } from 'react';
import { useChapterQuery } from '../../generated/graphql';

const { data } = useChapterQuery({});

export const ChapterCardData = createContext(data);
