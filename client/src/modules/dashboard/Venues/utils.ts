import { useRouter } from 'next/router';
import { useCreateVenueMutation } from '../../../generated/graphql';
import { VenueFormData } from './components/VenueForm';
import { VENUES } from './graphql/queries';

export const useSubmitVenue = () => {
  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });
  const router = useRouter();

  return async (data: VenueFormData) => {
    const { chapter_id, ...createData } = data;

    const latitude = parseFloat(String(data.latitude));
    const longitude = parseFloat(String(data.longitude));

    const { data: venueData, errors } = await createVenue({
      variables: {
        chapterId: chapter_id,
        data: { ...createData, latitude, longitude },
      },
    });
    // TODO: handle apollo errors centrally if possible
    if (errors) throw errors;
    if (venueData) {
      router.replace(`/dashboard/venues/${venueData.createVenue.id}`);
    }
  };
};
