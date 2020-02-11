import React, { useState } from 'react';
import useForm from 'react-hook-form';

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

  const { register, handleSubmit } = useForm();

  // TODO: Get data from store
  // const eventId = useSelector(state => state.selectedChapter.eventId);
  // const chapterId = useSelector(state => state.selectedChapter.id);

  const onSubmit = async data => {
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
          <TextField
            label="Sponsor Name"
            name="name"
            type="text"
            placeholder="Glitter and Sparkle Co"
            ref={register}
            required
          />
        </FormControl>
        <FormControl className={styles.item}>
          <TextField
            label="Sponsor Website"
            name="website"
            type="text"
            placeholder="www.glitter.co"
            ref={register}
            required
          />
        </FormControl>
        <FormControl className={styles.item}>
          <InputLabel id="sponsor-type-label">Sponsor Type</InputLabel>
          <Select labelId="sponsor-type-label" ref={register} required>
            <MenuItem value={'FOOD'}>Food</MenuItem>
            <MenuItem value={'BEVERAGE'}>Beverage</MenuItem>
            <MenuItem value={'OTHER'}>Other</MenuItem>
          </Select>
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
