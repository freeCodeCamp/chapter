import React, { useState } from 'react';
import useForm from 'react-hook-form';

import { Button, TextField, makeStyles } from '@material-ui/core';

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
        <TextField
          label="Sponsor Name"
          name="name"
          type="text"
          placeholder="Glitter and Sparkle Co"
          ref={register}
          required
          className={styles.item}
        />
        <TextField
          label="Sponsor Website"
          name="website"
          type="text"
          placeholder="www.glitter.co"
          ref={register}
          required
          className={styles.item}
        />
        <label className={styles.item}>
          Sponsor Type:
          <select name="type" required ref={register}>
            <option value="FOOD">Food</option>
            <option value="BEVERAGE">Beverage</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
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
