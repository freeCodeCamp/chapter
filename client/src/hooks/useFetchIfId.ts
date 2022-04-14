import { useEffect } from 'react';

interface Options {
  variables: {
    id: number;
  };
}

export function useFetchIfId(
  id: number | null,
  fetchData: (options: Options) => void,
): void {
  useEffect(() => {
    if (id !== null) {
      fetchData({
        variables: { id },
      });
    }
  }, [id]);
}
