import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ChapterVenuesQueryResult } from '../../../../generated/graphql';

import { Input } from '../../../../components/Form/Input';
import { Select } from '../../../../components/Form/Select';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { venueTypes } from './EventFormUtils';

interface EventVenueFormProps {
  chapterVenuesQuery: ChapterVenuesQueryResult;
  loading: boolean;
  venueId: number | undefined;
}

const EventVenueForm: React.FC<EventVenueFormProps> = ({
  chapterVenuesQuery,
  loading: loadingForm,
  venueId,
}) => {
  const { loading, error, data } = chapterVenuesQuery;

  const {
    getValues,
    register,
    resetField,
    watch,
    formState: { errors },
  } = useFormContext();
  const venueType = watch('venue_type');

  useEffect(() => {
    resetField('venue_id', {
      defaultValue: venueId ?? data?.chapterVenues[0]?.id ?? -1,
    });
  }, [data]);

  const getError = useCallback(
    (key: string) => {
      return errors[key]?.message as string;
    },
    [errors],
  );

  return (
    <>
      <FormControl isRequired isInvalid={!!getError('venue_type')}>
        <FormLabel>Venue Type</FormLabel>
        <RadioGroup defaultValue={venueType}>
          <HStack>
            {venueTypes.map((venueType) => (
              <Radio
                key={venueType.value}
                value={venueType.value}
                isDisabled={loadingForm}
                isInvalid={!!getError('venue_type')}
                {...register('venue_type')}
              >
                {venueType.name}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
        <FormErrorMessage>{getError('venue_type')}</FormErrorMessage>
      </FormControl>

      {loading ? (
        <h1>Loading venues...</h1>
      ) : error || !data ? (
        <h1>Error loading venues</h1>
      ) : (
        isPhysical(getValues('venue_type')) && (
          <Select
            label="Venue"
            key="venue_id"
            isRequired={true}
            isDisabled={loadingForm}
            error={getError('venue_id')}
            options={[
              { id: 0, name: 'Undecided/TBD' },
              ...data.chapterVenues.map((venue) => ({
                id: venue.id,
                name: venue.name,
              })),
            ]}
            {...register('venue_id')}
          />
        )
      )}

      {isOnline(getValues('venue_type')) && (
        <Input
          key="streaming url"
          type="url"
          label="Streaming URL"
          placeholder=""
          error={getError('streaming_url')}
          isDisabled={loadingForm}
          {...register('streaming_url')}
        />
      )}
    </>
  );
};

export default EventVenueForm;
