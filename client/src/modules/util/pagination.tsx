import { Button } from '@chakra-ui/react';
import React from 'react';

interface PaginationProps<T, V> {
  data: Array<T>;
  dataFlattener: (page: T) => Array<V>;
  displayOnEmpty?: React.ReactNode;
  itemsPerPage: number;
  mapper: (item: V) => React.ReactNode;
  onClickForMore: (offset: number) => void;
  totalItemsFromData: (data: Array<T>) => number;
}

export const Pagination = <T, V>({
  data,
  dataFlattener,
  displayOnEmpty,
  itemsPerPage,
  mapper,
  onClickForMore,
  totalItemsFromData,
}: PaginationProps<T, V>) => {
  const flattenedData = data.flatMap(dataFlattener);
  const currentPage = Math.ceil(flattenedData.length / itemsPerPage);
  const totalPages = Math.ceil(totalItemsFromData(data) / itemsPerPage);
  const hasMorePages = totalPages > currentPage;
  const offset = currentPage * itemsPerPage;

  return (
    <>
      {flattenedData.map(mapper)}
      {hasMorePages ? (
        <Button
          colorScheme={'blue'}
          data-testid="pagination"
          onClick={() => hasMorePages && onClickForMore(offset)}
        >
          Click for more
        </Button>
      ) : (
        displayOnEmpty
      )}
    </>
  );
};
