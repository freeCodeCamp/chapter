import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Venue, Location } from '../../models';
import { CreateVenueInputs, UpdateVenueInputs } from './inputs';

@Resolver()
export class VenueResolver {
  @Query(() => [Venue])
  venues() {
    return Venue.find();
  }

  @Query(() => Venue, { nullable: true })
  venue(@Arg('id', () => Int) id: number) {
    return Venue.findOne(id);
  }

  @Mutation(() => Venue)
  async createVenue(@Arg('data') data: CreateVenueInputs) {
    const location = await Location.findOne(data.locationId);

    if (!location) throw new Error('Cant find location');

    const venue = new Venue({ name: data.name, location });
    return venue.save();
  }

  @Mutation(() => Venue)
  async updateVenue(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateVenueInputs,
  ) {
    const venue = await Venue.findOne(id);
    if (!venue) throw new Error('Cant find venue');

    if (data.locationId) {
      const location = await Location.findOne(data.locationId);
      if (!location) throw new Error('Cant find location');
      venue.location = location;
    }

    venue.name = data.name ?? venue.name;

    return venue.save();
  }

  @Mutation(() => Boolean)
  async deleteVenue(@Arg('id', () => Int) id: number) {
    const venue = await Venue.findOne(id);

    if (!venue) throw new Error('Cant find venue');

    await venue.remove();

    return true;
  }
}
