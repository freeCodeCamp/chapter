import { company, internet, system } from 'faker';
import { Sponsor } from '../../../server/models';
import { randomEnum } from '../lib/random';

enum SponsorTypes {
  'FOOD',
  'VENUE',
  'OTHER',
}

const createSponsors = async (): Promise<Sponsor[]> => {
  const sponsors: Sponsor[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.companyName();
    const website = internet.url();
    const logoPath = system.commonFileName('png');
    const type = String(randomEnum(SponsorTypes));

    const sponsor = new Sponsor({
      name,
      website,
      logoPath,
      type,
    });

    sponsors.push(sponsor);
  }

  try {
    await Promise.all(sponsors.map(sponsor => sponsor.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding locations');
  }

  return sponsors;
};

export default createSponsors;
