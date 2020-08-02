import { company, address } from 'faker';
import { Venue } from '../../../server/models';

const createVenues = async (): Promise<Venue[]> => {
  const venues: Venue[] = [];

  for (let i = 0; i < 4; i++) {
    const venue = new Venue({
      name: company.companyName(),
      city: address.city(),
      region: address.state(),
      postal_code: address.zipCode(),
      country: address.country(),
      street_address: Math.random() > 0.5 ? address.streetAddress() : undefined,
    });

    venues.push(venue);
  }

  try {
    await Promise.all(venues.map(venue => venue.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding venues');
  }

  return venues;
};

export default createVenues;
