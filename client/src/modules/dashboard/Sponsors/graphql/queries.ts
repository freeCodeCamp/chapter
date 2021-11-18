import { gql } from '@apollo/client';

export const SPONSOR = gql`
  query sponsor($sponsorId: Int!) {
    sponsor(id: $sponsorId) {
      id
      name
      website
      logo_path
      type
    }
  }
`;

export const createSponsor = gql`
  mutation createSponsor($data: CreateSponsorInputs!) {
    createSponsor(data: $data) {
      name
      website
      logo_path
      type
    }
  }
`;

export const updateSponsor = gql`
  mutation updateSponsor($data: UpdateSponsorInputs!, $updateSponsorId: Int!) {
    updateSponsor(data: $data, id: $updateSponsorId) {
      name
      website
      logo_path
      type
    }
  }
`;
