import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className={'tab-panel' + (value === index ? ' open' : '')}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3} component="div">
        <Typography component="div">{children}</Typography>
      </Box>
    </div>
  );
}
