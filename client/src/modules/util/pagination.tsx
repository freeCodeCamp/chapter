import { ApolloQueryResult, FetchMoreQueryOptions } from '@apollo/client';
import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

interface FetchMoreArg {
  offset: number;
  limit: number;
}

interface PaginationProps<T> {
  items: Array<T>;
  fetchMore: <Q>(
    options: FetchMoreQueryOptions<FetchMoreArg, Q>,
  ) => Promise<ApolloQueryResult<Q>>;
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
  const [isLoading, setLoading] = useState(false);
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
          isLoading={isLoading}
          onClick={async () => {
            setLoading(true);
            await fetchMore({ variables: { offset, limit } });
            setLoading(false);
          }}
        >
          Click for more
        </Button>
      ) : (
        displayOnEmpty
      )}
    </>
  );
};
