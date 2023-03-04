import { useState } from 'react';

import { useAlert } from './useAlert';

export const useDisableWhileSubmitting = <T>({
  onSubmit,
  enableOnSuccess = false,
}: {
  onSubmit: (x: T) => Promise<void>;
  enableOnSuccess?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const addAlert = useAlert();
  return {
    loading,
    disableWhileSubmitting: async (data: T) => {
      setLoading(true);
      try {
        await onSubmit(data);
      } catch (err) {
        addAlert({
          title: 'Something went wrong.',
          status: 'error',
        });
        console.error(err);
        setLoading(false);
      }
      if (enableOnSuccess) {
        setLoading(false);
      }
    },
  };
};
