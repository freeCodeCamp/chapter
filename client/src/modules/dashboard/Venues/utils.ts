import { useRouter } from 'next/router';

import { useCreateVenueMutation } from '../../../generated/graphql';
import { useAlert } from '../../../hooks/useAlert';
import { parseVenueData, VenueFormData } from './components/VenueFormUtils';
import { DASHBOARD_VENUES } from './graphql/queries';

export const useSubmitVenue = () => {
  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: DASHBOARD_VENUES }],
  });
  const router = useRouter();
  const addAlert = useAlert();

  return async (data: VenueFormData) => {
    const { data: venueData, errors } = await createVenue({
      variables: { chapterId: data.chapter_id, data: parseVenueData(data) },
    });
    // TODO: handle apollo errors centrally if possible
    if (errors) throw errors;
    if (venueData) {
      await router.replace(`/dashboard/venues/${venueData.createVenue.id}`);
      addAlert({
        title: `Venue "${venueData.createVenue.name}" created!`,
        status: 'success',
      });
    }
  };
};
