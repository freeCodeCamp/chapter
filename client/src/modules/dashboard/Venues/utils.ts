import { useRouter } from 'next/router';
import { useCreateVenueMutation } from '../../../generated/graphql';
import { VenueFormData } from './components/VenueForm';
import { VENUES } from './graphql/queries';

export const useSubmitVenue = (setLoading: (x: boolean) => void) => {
  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });
  const router = useRouter();

  return async (data: VenueFormData) => {
    setLoading(true);
    const { chapter_id, ...createData } = data;
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      const venue = await createVenue({
        variables: {
          chapterId: chapter_id,
          data: { ...createData, latitude, longitude },
        },
      });
      if (venue.data) {
        router.replace(`/dashboard/venues/${venue.data.createVenue.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
};
