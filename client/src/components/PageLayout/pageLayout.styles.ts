import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  pageRoot: {
    [theme.breakpoints.down('xl')]: {
      padding: `0 ${theme.spacing(8)}px`,
    },
    [theme.breakpoints.down('md')]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  headerContainer: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    'text-align': 'center',
    'padding-bottom': `${theme.spacing(2)}px`,
    'padding-top': `${theme.spacing(2)}px`,
    [theme.breakpoints.up('md')]: {
      'justify-content': 'space-between',
    },
  },
}));

export default useStyles;
