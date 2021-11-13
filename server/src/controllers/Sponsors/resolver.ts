import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { CreateSponsorInputs, UpdateSponsorInputs } from './input';
import { Sponsor } from 'src/models';
@Resolver()
export class SponsorResolver {
  @Query(() => [Sponsor])
  sponsors() {
    return Sponsor.find();
  }
  @Query(() => Sponsor, { nullable: true })
  sponsor(@Arg('id', () => Int) id: number) {
    return Sponsor.findOne(id);
  }

  @Mutation(() => Sponsor)
  async createSponsor(@Arg('data') data: CreateSponsorInputs) {
    const sponsor = new Sponsor({ ...data });
    return sponsor.save();
  }

  @Mutation(() => Sponsor)
  async updateSponsor(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateSponsorInputs,
  ) {
    const sponsor = await Sponsor.findOne(id);
    if (!sponsor) {
      throw new Error('Unable to find the sponsor with id ' + id);
    }
    sponsor.name = data?.name;
    sponsor.website = data?.website;
    sponsor.logo_path = data?.logo_path;
    sponsor.type = data?.type;

    return sponsor.save();
  }
}
