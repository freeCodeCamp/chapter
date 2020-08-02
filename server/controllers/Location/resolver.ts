import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Location } from '../../models';
import { CreateLocationInputs, UpdateLocationInputs } from './inputs';

@Resolver()
export class LocationResolver {
  @Query(() => [Location])
  locations() {
    return Location.find();
  }

  @Query(() => Location, { nullable: true })
  location(@Arg('id', () => Int) id: number) {
    return Location.findOne(id);
  }

  @Mutation(() => Location)
  async createLocation(@Arg('data') data: CreateLocationInputs) {
    const location = new Location({ ...data });
    return location.save();
  }

  @Mutation(() => Location)
  async updateLocation(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateLocationInputs,
  ) {
    const location = await Location.findOne(id);

    if (!location) throw new Error('Cant find location');

    location.country_code = data.country_code ?? location.country_code;
    location.city = data.city ?? location.city;
    location.region = data.region ?? location.region;
    location.postal_code = data.postal_code ?? location.postal_code;
    location.address = data.address ?? location.address;

    return location.save();
  }

  @Mutation(() => Boolean)
  async deleteLocation(@Arg('id', () => Int) id: number) {
    const location = await Location.findOne(id);

    if (!location) throw new Error('Cant find location');

    await location.remove();

    return true;
  }
}
