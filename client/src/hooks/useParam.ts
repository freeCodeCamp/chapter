import { useRouter } from 'next/router';

export const useParam = (key = 'id') => {
  const router = useRouter();
  const val = router.query[key];

  if (val) {
    if (Array.isArray(val)) {
      return parseInt(val[0]);
    }

    return parseInt(val);
  }

  return -1;
};
