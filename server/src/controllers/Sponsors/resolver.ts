import { Resolver, Query } from 'type-graphql';
import { Sponsor } from '../../models/Sponsor';
@Resolver()
export class SponsorResolver {
  @Query(() => [Sponsor])
  sponsors() {
    return Sponsor.find();
  }
}
