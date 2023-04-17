import React from 'react';

import { VenueType } from '../../../../generated/graphql';
import getLocationString, {
  PartialLocation,
} from '../../../../util/getLocationString';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { LinkField, TextField } from './Fields';

interface EventVenueProps {
  event: {
    venue_type: VenueType;
    venue?: (PartialLocation & { name: string }) | null;
    streaming_url?: string | null | undefined;
  };
}

export const EventVenue = ({
  event: { venue_type, venue, streaming_url },
}: EventVenueProps) => {
  const { streamingText, StreamingComponent } = !streaming_url
    ? { streamingText: 'Undecided/TBD', StreamingComponent: TextField }
    : { streamingText: streaming_url, StreamingComponent: LinkField };
  return (
    <>
      {isPhysical(venue_type) && (
        <>
          <TextField label="Venue">{venue?.name || 'Undecided/TBD'}</TextField>
          {venue && (
            <TextField label="Hosted at">
              {getLocationString(venue, true)}
            </TextField>
          )}
        </>
      )}
      {isOnline(venue_type) && (
        <StreamingComponent label="Streaming Url" isExternal>
          {streamingText}
        </StreamingComponent>
      )}
    </>
  );
};
