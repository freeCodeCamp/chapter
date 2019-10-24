import React, { useState } from 'react';
import { string } from 'prop-types';
import axios from 'axios';

const AddSponsor = ({ eventId, chapterId }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ type: 'FOOD' });
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    /* Block double submits */
    if (isSubmitting) {
      return false;
    }

    e.preventDefault();
    setSubmitting(true);

    try {
      const data = JSON.stringify(values);
      await axios.post(`/${chapterId}/events/${eventId}/sponsors`, data);
    } catch (error) {
      // TODO: Error Handling
    } finally {
      setSubmitting(false);
      setSuccess(true);
    }
  }

  return (
    <div>
      {success && <div>Sponser has been added!</div>}
      <form onSubmit={handleSubmit}>
        <label>Sponsor Name: </label>
        <input
          name="name"
          type="text"
          placeholder="Glitter and Sparkle Co"
          onChange={handleChange}
        />{' '}
        <br />
        <br />
        <label>Sponsor Website: </label>
        <input
          name="website"
          type="text"
          placeholder="www.glitter.co"
          onChange={handleChange}
        />{' '}
        <br />
        <br />
        <label>Sponsor Type: </label>
        <select name="type" onChange={handleChange}>
          <option value="FOOD">Food</option>
          <option value="BEVEREGE">Beverege</option>
          <option value="OTHER">Other</option>
        </select>{' '}
        <br />
        <br />
        <input name="eventId" type="hidden" value={eventId} />
        <input name="chapterId" type="hidden" value={chapterId} />
        <button type="submit">Add Sponsor</button>
      </form>
    </div>
  );
};

AddSponsor.propTypes = {
  eventId: string,
  chapterId: string,
};

export default AddSponsor;
