import { Button } from '@chakra-ui/react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  onClickForMore: () => void;
  eventCards: number;
  records: number;
  displayOnEmpty?: React.ReactNode;
}

export const Pagination = ({
  currentPage,
  onClickForMore,
  eventCards,
  records,
  displayOnEmpty,
}: PaginationProps) => {
  const totalPages = Math.ceil(records / eventCards);
  const hasMoreEvents = totalPages > currentPage;
  return (
    <>
      {hasMoreEvents ? (
        <Button
          colorScheme={'blue'}
          data-testid="pagination"
          onClick={() => hasMoreEvents && onClickForMore()}
        >
          Click for more
        </Button>
      ) : (
        displayOnEmpty
      )}
    </>
  );
};
