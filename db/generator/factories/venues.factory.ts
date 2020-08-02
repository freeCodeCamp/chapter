import { company } from 'faker';
import { Location, Venue } from '../../../server/models';
import { randomItem } from '../lib/random';

const createVenues = async (locations: Location[]): Promise<Venue[]> => {
  const venues: Venue[] = [];

  for (let i = 0; i < 4; i++) {
    const venue = new Venue({
      name: company.companyName(),
      location: randomItem(locations),
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
