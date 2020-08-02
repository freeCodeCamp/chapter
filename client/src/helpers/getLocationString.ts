import { ILocationModal } from 'client/store/types/locations';

const getLocationString = (
  location: ILocationModal,
  withCity = false,
): string => {
  const base = `${location.region}, ${location.country_code}, ${location.postal_code}`;

  if (withCity) {
    return `${base}, ${location.city}`;
  }

  return base;
};

export default getLocationString;
