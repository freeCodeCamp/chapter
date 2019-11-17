import * as React from 'react';
import fetch from 'isomorphic-fetch';
import useForm from 'react-hook-form';

import {
  Form,
  Input,
  ResponseDiv,
  SubmitBtn,
} from 'client/styles/components/AddSponsor';
import {
  IAddSponsorProps,
  ISponsorData,
} from 'client/interfaces/components/AddSponsor';

const AddSponsor: React.FC<IAddSponsorProps> = ({ eventId, chapterId }) => {
  const [responseMsg, setResponseMsg] = React.useState('');

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async data => {
    const { name, website, type }: ISponsorData = data;
    try {
      await fetch(`/${chapterId}/events/${eventId}/sponsors`, {
        // TODO: create route
        method: 'post',
        body: {
          name,
          website,
          type,
        },
      });
      setResponseMsg(`${name} has been added as a ${type} sponsor.`);
    } catch (e) {
      setResponseMsg('Uh oh, something went wrong.');
      // TODO: more descriptive error messages
    }
  };

  return (
    <>
      {(responseMsg || errors) && <ResponseDiv>{responseMsg}</ResponseDiv>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>Sponsor Name: </label>
        <Input
          name="name"
          type="text"
          placeholder="Glitter and Sparkle Co"
          ref={register}
          required
        />
        <label>Sponsor Website: </label>
        <Input
          name="website"
          type="text"
          placeholder="www.glitter.co"
          ref={register}
          required
        />
        <label>Sponsor Type: </label>
        <select name="type" required ref={register}>
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
