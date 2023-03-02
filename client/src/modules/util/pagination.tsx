import { Button } from '@chakra-ui/react';
import React from 'react';

interface FetchMoreArg {
  variables: {
    offset: number;
    limit: number;
  };
}

interface PaginationProps<T> {
  items: Array<T>;
  fetchMore: (arg: FetchMoreArg) => void;
  limit: number;
  total: number;
  displayOnEmpty?: React.ReactNode;
}

export const Pagination = <T,>({
  items,
  fetchMore,
  limit,
  total,
  displayOnEmpty,
}: PaginationProps<T>) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.ceil(items.length / limit);
  const hasMorePages = totalPages > currentPage;
  const offset = currentPage * limit;
  return (
    <>
      {items}
      {hasMorePages ? (
        <Button
          colorScheme={'blue'}
          data-testid="pagination"
          onClick={() => fetchMore({ variables: { offset, limit } })}
        >
          Click for more
        </Button>
      ) : (
        displayOnEmpty
      )}
    </>
  );
};
