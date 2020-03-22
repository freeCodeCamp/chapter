import { makeStyles } from '@material-ui/core';

const useFormStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
  },
  item: {
    marginTop: '20px',
  },
}));

export default useFormStyles;
