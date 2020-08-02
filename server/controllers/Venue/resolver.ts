import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Venue } from '../../models';
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
    const venue = new Venue({ ...data });
    return venue.save();
  }

  @Mutation(() => Venue)
  async updateVenue(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateVenueInputs,
  ) {
    const venue = await Venue.findOne(id);
    if (!venue) throw new Error('Cant find venue');

    venue.name = data.name ?? venue.name;
    venue.street_address = data.street_address ?? venue.street_address;
    venue.city = data.city ?? venue.city;
    venue.postal_code = data.postal_code ?? venue.postal_code;
    venue.region = data.region ?? venue.region;
    venue.country = data.country ?? venue.country;
    venue.latitude = data.latitude ?? venue.latitude;
    venue.longitude = data.longitude ?? venue.longitude;

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
