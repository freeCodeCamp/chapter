import { useRouter } from 'next/router';

export const useParam = (key = 'id') => {
  const router = useRouter();

  const val = router.query[key];
  const firstVal = Array.isArray(val) ? val[0] : val;
  return firstVal ? { param: parseInt(firstVal) } : { param: -1 };
};
