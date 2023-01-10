import { gql } from '@apollo/client';

export const createVenue = gql`
  mutation createVenue($chapterId: Int!, $data: VenueInputs!) {
    createVenue(chapterId: $chapterId, data: $data) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;

export const updateVenue = gql`
  mutation updateVenue($venueId: Int!, $chapterId: Int!, $data: VenueInputs!) {
    updateVenue(id: $venueId, _onlyUsedForAuth: $chapterId, data: $data) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;

export const deleteVenue = gql`
  mutation deleteVenue($venueId: Int!, $chapterId: Int!) {
    deleteVenue(_onlyUsedForAuth: $chapterId, id: $venueId) {
      id
    }
  }
`;
