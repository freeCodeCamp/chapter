import * as React from 'react';
import useForm from 'react-hook-form';

import {
  Form,
  Input,
  ResponseDiv,
  SubmitBtn,
} from 'client/styles/components/AddSponsor';

const AddSponsor: React.FC = () => {
  const [responseMsg, setResponseMsg] = React.useState('');

  const { register, handleSubmit, errors } = useForm();

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
