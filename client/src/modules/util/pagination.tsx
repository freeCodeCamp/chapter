import { Button } from '@chakra-ui/react';
import React from 'react';

interface PaginationProps<T, V> {
  data: Array<T>;
  mapper: (item: T) => V;
  currentPage: number;
  onClickForMore: () => void;
  itemsPerPage: number;
  records: number;
  displayOnEmpty?: React.ReactNode;
}

export const Pagination = <T, V>({
  data,
  mapper,
  currentPage,
  onClickForMore,
  itemsPerPage,
  records,
  displayOnEmpty,
}: PaginationProps<T, V>) => {
  const totalPages = Math.ceil(records / itemsPerPage);
  const hasMorePages = totalPages > currentPage;
  return (
    <>
      {data.map(mapper)}
      {hasMorePages ? (
        <Button
          colorScheme={'blue'}
          data-testid="pagination"
          onClick={() => hasMorePages && onClickForMore()}
        >
          Click for more
        </Button>
      ) : (
        displayOnEmpty
      )}
    </>
  );
};
