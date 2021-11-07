import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { CreateSponsorInputs } from './input';
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
}
