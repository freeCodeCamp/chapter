/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useRouter } from 'next/router';

export const useParam = <T extends 'number' | 'string'>(
  key = 'id',
  // @ts-ignore
  type: T = 'number',
): T extends 'number' ? number : string => {
  const router = useRouter();
  const val = router.query[key];

  if (val) {
    if (Array.isArray(val)) {
      // @ts-ignore
      return type === 'number' ? parseInt(val[0]) : val[0];
    }

    // @ts-ignore
    return type === 'number' ? parseInt(val) : val;
  }

  // @ts-ignore
  return type === 'number' ? -1 : '';
};
