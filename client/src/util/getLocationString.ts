export interface PartialLocation {
  street_address?: string | null;
  city: string;
  postal_code?: string;
  region: string;
  country: string;
}

const getLocationString = (
  venue: PartialLocation,
  withCity = false,
): string => {
  const base = `${venue.region}, ${venue.country}, ${venue.postal_code}`;

  if (withCity) {
    return `${base}, ${venue.city}`;
  }

  return base;
};

export default getLocationString;
