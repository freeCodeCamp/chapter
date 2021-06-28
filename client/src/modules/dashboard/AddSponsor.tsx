import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  TextField,
  makeStyles,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '25%',
  },
  item: {
    marginTop: '20px',
  },
  responseDiv: {
    margin: '15px 0',
  },
}));

const AddSponsor: React.FC = () => {
  const [responseMsg, setResponseMsg] = useState('');
  const styles = useStyles();

  const { control, handleSubmit } = useForm();

  // TODO: Get data from store
  // const eventId = useSelector(state => state.selectedChapter.eventId);
  // const chapterId = useSelector(state => state.selectedChapter.id);

  const onSubmit = async (data: any) => {
    try {
      // await dispatch(sponsorActions.submit(eventId, chapterId));
      setResponseMsg(`${data.name} has been added as a ${data.type} sponsor.`);
    } catch (e) {
      setResponseMsg('Uh oh, something went wrong.');
      // TODO: more descriptive error messages
    }
  };

  return (
    <>
      {responseMsg && <div className={styles.responseDiv}>{responseMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormControl className={styles.item}>
          <Controller
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                name="name"
                type="text"
                label="Sponsor Name"
                placeholder="Glitter and Sparkle Co"
              />
            )}
            name="name"
            rules={{ required: true }}
          />
        </FormControl>
        <FormControl className={styles.item}>
          <Controller
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sponsor Website"
                name="website"
                type="text"
                placeholder="www.glitter.co"
              />
            )}
            name="website"
            rules={{ required: true }}
          />
        </FormControl>
        <FormControl className={styles.item}>
          <InputLabel id="sponsor-type-label">Sponsor Type</InputLabel>
          <Controller
            control={control}
            render={({ field }) => (
              <Select {...field} labelId="sponsor-type-label">
                <MenuItem value={'FOOD'}>Food</MenuItem>
                <MenuItem value={'BEVERAGE'}>Beverage</MenuItem>
                <MenuItem value={'OTHER'}>Other</MenuItem>
              </Select>
            )}
            name="type"
            defaultValue={'OTHER'}
            rules={{ required: true }}
          />
        </FormControl>
        <Button
          className={styles.item}
          variant="contained"
          color="primary"
          type="submit"
        >
          Add Sponsor
        </Button>
      </form>
    </>
  );
};

export default AddSponsor;
