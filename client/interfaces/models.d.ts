// Here types are inherited from actual DB Modal Types
// created [here](types/models.d.ts)
// This is re

import { ISponsor } from 'types/models';

export type ISponsorResponse = Omit<ISponsor, 'createdAt' | 'updatedAt'>;
