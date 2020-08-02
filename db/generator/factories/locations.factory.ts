import { address } from 'faker';
import { Location } from '../../../server/models';

const createLocations = async (): Promise<Location[]> => {
  const locations: Location[] = [];

  for (let i = 0; i < 4; i++) {
    const location = new Location({
      country_code: address.countryCode(),
      city: address.city(),
      region: address.state(),
      postal_code: address.zipCode(),
      address: Math.random() > 0.5 ? address.streetAddress() : undefined,
    });

    locations.push(location);
  }

  try {
    await Promise.all(locations.map(location => location.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding locations');
  }

  return locations;
};

export default createLocations;
