import * as React from 'react';
import fetch from 'isomorphic-fetch';

import { Form, Input, ResponseDiv, SubmitBtn } from 'client/styles/AddSponsor';
import { IAddSponsorProps, ISponsorData } from 'client/interfaces/AddSponsor';

const AddSponsor: React.FC<IAddSponsorProps> = ({ eventId, chapterId }) => {
  const [isSubmitting, setSubmitting] = React.useState(false);
  // we specify type as food as state is only updated on field change. Since field
  // defaults to food and the user doesn't change it, state would be empty
  const [values, setValues] = React.useState<ISponsorData>({
    name: '',
    website: '',
    type: 'FOOD',
  });
  const [responseMsg, setResponseMsg] = React.useState<string>();

  function handleChange(e) {
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    /* Block double submits */
    if (isSubmitting) {
      return false;
    }

    e.preventDefault();
    setSubmitting(true);

    const data = JSON.stringify(values);
    fetch(`/${chapterId}/events/${eventId}/sponsors`, {
      // TODO: create route
      method: 'post',
      body: data,
    }).then(res => {
      if (res.status != 200) {
        setResponseMsg('Uh oh, something went wrong.'); // TODO: more descriptive error messages
        setSubmitting(false);
      } else {
        setResponseMsg(
          `${values.name} has been added as a ${values.type.toLowerCase} sponsor.`,
        );
        setSubmitting(false);
      }
    });

    setSubmitting(false);
  }

  return (
    <>
      {responseMsg && <ResponseDiv>{responseMsg}</ResponseDiv>}
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
          <option value="BEVERAGE">Beverage</option>
          <option value="OTHER">Other</option>
        </select>
        <SubmitBtn type="submit">Add Sponsor</SubmitBtn>
      </Form>
    </>
  );
};

export default AddSponsor;
