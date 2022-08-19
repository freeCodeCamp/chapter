import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useParam = (key = 'id') => {
  const router = useRouter();
  const [isReady, setReady] = useState(false);
  const [param, setParam] = useState(-1);
  const val = router.query[key];

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
      if (val) {
        if (Array.isArray(val)) {
          setParam(parseInt(val[0]));
        } else {
          setParam(parseInt(val));
        }
      }
    }
  }, [router.isReady]);

  return { param, isReady };
};
