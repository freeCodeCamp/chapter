import { gql } from '@apollo/client';

export const createVenue = gql`
  mutation createVenue($chapterId: Int!, $data: CreateVenueInputs!) {
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
  mutation updateVenue(
    $venueId: Int!
    $chapterId: Int!
    $data: UpdateVenueInputs!
  ) {
    updateVenue(venueId: $venueId, chapterId: $chapterId, data: $data) {
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
