import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Select,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ChapterVenuesQueryResult } from '../../../../generated/graphql';

import { Input } from '../../../../components/Form/Input';
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

  const { getValues, register, resetField, watch } = useFormContext();
  const venueType = watch('venue_type');

  useEffect(() => {
    resetField('venue_id', {
      defaultValue: venueId ?? data?.chapterVenues[0]?.id ?? -1,
    });
  }, [data]);

  return (
    <FormControl isRequired marginBlock="1em">
      <FormLabel>Venue Type (Required)</FormLabel>
      <RadioGroup defaultValue={venueType}>
        <HStack>
          {venueTypes.map((venueType) => (
            <Radio
              key={venueType.value}
              value={venueType.value}
              isDisabled={loadingForm}
              {...register('venue_type')}
            >
              {venueType.name}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>

      {loading ? (
        <h1>Loading venues...</h1>
      ) : error || !data ? (
        <h1>Error loading venues</h1>
      ) : (
        isPhysical(getValues('venue_type')) && (
          <FormControl isRequired marginBlock="1em">
            <FormLabel>Venue</FormLabel>
            <Select
              {...register('venue_id' as const, { valueAsNumber: true })}
              isDisabled={loadingForm}
            >
              {data.chapterVenues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )
      )}

      <Box marginTop="1em">
        {isOnline(getValues('venue_type')) && (
          <Input
            key="streaming url"
            type="url"
            label="Streaming URL"
            placeholder=""
            isDisabled={loadingForm}
            {...register('streaming_url')}
          />
        )}
      </Box>
    </FormControl>
  );
};

export default EventVenueForm;
