import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  headerContainer: {
    'align-items': 'center',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    display: 'grid',
    'justify-items': 'center',
    [theme.breakpoints.down('sm')]: {
      'grid-template-rows': '1fr 1fr 1fr',
    },
    [theme.breakpoints.down('md')]: {
      'grid-template-columns': 'none',
    },
    [theme.breakpoints.up('md')]: {
      'grid-template-columns': '1fr 1fr 1fr',
    },
  },
  navList: {
    display: 'grid',
    'list-style': 'none',
    'grid-column-gap': theme.spacing(1),
    'grid-template-columns': '1fr 1fr 1fr 1fr',
    'text-align': 'center',
    'padding-inline-start': 0,
  },
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
}));

export default useStyles;
