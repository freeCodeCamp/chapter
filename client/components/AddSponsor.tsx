import * as React from 'react';
import styled from 'styled-components';

interface AddSponsorProps {
  eventId: string;
  chapterId: string;
}

interface SponsorData {
  name: string;
  website: string;
  type: 'FOOD' | 'BEVERAGE' | 'OTHER'; // TODO: Add VENUE
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 25%;
`;

const Input = styled.input`
  margin-bottom: 15px;
`;

const ResponseDiv = styled.div`
  margin: 15px 0;
`;
// TODO: Style div based on response reveived

const AddSponsor: React.FC<AddSponsorProps> = ({ eventId, chapterId }) => {
  const [isSubmitting, setSubmitting] = React.useState(false);
  // we specify type as food as state is only updated on field change. Since field
  // defaults to food and the user doesn't change it, state would be empty
  const [values, setValues] = React.useState<SponsorData>({
    name: '',
    website: '',
    type: 'FOOD',
  });
  const [success, setSuccess] = React.useState(false);

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
        // TODO: create route
        method: 'post',
        body: data,
      });
      setSuccess(true); // TODO: call only if 200 res is received from api
    } catch (error) {
      // TODO: Error Handling
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {success && <ResponseDiv>{values.name} has been added!</ResponseDiv> //TODO: dynamic message based on response
      }
      <Form onSubmit={handleSubmit}>
        <label>Sponsor Name: </label>
        <Input
          name="name"
          type="text"
          placeholder="Glitter and Sparkle Co"
          onChange={handleChange}
        />
        <label>Sponsor Website: </label>
        <Input
          name="website"
          type="text"
          placeholder="www.glitter.co"
          onChange={handleChange}
        />
        <label>Sponsor Type: </label>
        <select name="type" onChange={handleChange}>
          <option value="FOOD">Food</option>
          <option value="BEVEREGE">Beverege</option>
          <option value="OTHER">Other</option>
        </select>
        <br />
        <br />
        <button type="submit">Add Sponsor</button>
      </Form>
    </>
  );
};

export default AddSponsor;
