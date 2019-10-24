import * as React from 'react';

interface AddSponsorProps {
  eventId: string;
  chapterId: string;
}

interface SponsorData {
  name?: string;
  website?: string;
  type?: string;
}

const AddSponsor: React.FC<AddSponsorProps> = ({ eventId, chapterId }) => {
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<SponsorData>({ type: 'FOOD' });
  const [success, setSuccess] = React.useState<boolean>(false);

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
      await fetch(`/${chapterId}/events/${eventId}/sponsors`, {
        method: 'post',
        body: data,
      });
      setSuccess(true);
    } catch (error) {
      // TODO: Error Handling
    } finally {
      setSubmitting(false);
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
        />
        <br />
        <br />
        <label>Sponsor Website: </label>
        <input
          name="website"
          type="text"
          placeholder="www.glitter.co"
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Sponsor Type: </label>
        <select name="type" onChange={handleChange}>
          <option value="FOOD">Food</option>
          <option value="BEVEREGE">Beverege</option>
          <option value="OTHER">Other</option>
        </select>
        <br />
        <br />
        <button type="submit">Add Sponsor</button>
      </form>
    </div>
  );
};

export default AddSponsor;
