import { useEffect, useState } from 'react';

const useConfirm = (callback: () => void): [boolean, () => void] => {
  const [confirm, setConfirm] = useState<boolean>(false);

  const click = () => {
    if (confirm) {
      callback();
    } else {
      setConfirm(true);
    }
  };

  useEffect(() => {
    if (confirm) {
      setTimeout(() => {
        setConfirm(false);
      }, 2000);
    }
  }, [confirm]);

  return [confirm, click];
};

export default useConfirm;
