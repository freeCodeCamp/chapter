import { useToast } from '@chakra-ui/react';
import { useState } from 'react';

export const useDisableWhileSubmitting = <T>({
  onSubmit,
  enableOnSuccess = false,
}: {
  onSubmit: (x: T) => Promise<void>;
  enableOnSuccess?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  return {
    loading,
    disableWhileSubmitting: async (data: T) => {
      setLoading(true);
      try {
        await onSubmit(data);
      } catch (err) {
        toast({
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
