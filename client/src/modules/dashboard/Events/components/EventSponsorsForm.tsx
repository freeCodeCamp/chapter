import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spacer,
} from '@chakra-ui/react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { SponsorsQueryResult } from '../../../../generated/graphql';

import {
  getAllowedSponsors,
  getAllowedSponsorsForType,
  getAllowedSponsorTypes,
  sponsorTypes,
} from './EventFormUtils';

interface EventSponsorsFormProps {
  loading: boolean;
  sponsorsQuery: SponsorsQueryResult;
}

const EventSponsorsForm: React.FC<EventSponsorsFormProps> = ({
  loading: loadingForm,
  sponsorsQuery,
}) => {
  const { loading, error, data } = sponsorsQuery;

  const { control, getValues, setValue, register, watch } = useFormContext();
  const {
    append,
    fields: sponsorFields,
    remove,
  } = useFieldArray({
    control,
    keyName: 'key',
    name: 'sponsors',
  });
  const watchSponsorsArray = watch('sponsors');

  return (
    <FormControl id="sponsors" marginBottom="1em">
      <Box display="flex" alignItems="end" m="1">
        <FormLabel>Sponsors</FormLabel>
        <Spacer />
        <Button
          colorScheme="blue"
          onClick={() => {
            if (data) {
              const allowedSponsors = getAllowedSponsors(
                data,
                watchSponsorsArray,
              );
              append({
                type: allowedSponsors[0]?.type,
                id: allowedSponsors[0]?.id,
              });
            }
          }}
          isDisabled={
            loadingForm ||
            loading ||
            error ||
            !data ||
            sponsorFields.length < data.sponsors.length
              ? false
              : true
          }
        >
          Add Sponsor
        </Button>
      </Box>
      {sponsorFields.map((sponsorField, sponsorFieldId) => {
        const registeredSponsor = register(
          `sponsors.${sponsorFieldId}.type` as const,
          {
            required: false,
          },
        );

        return (
          <Flex key={sponsorField.key} borderWidth="1px" p="5" mb="5">
            <Box display="flex" flexGrow={1}>
              <FormControl m="1">
                <FormLabel>Sponsor Type</FormLabel>
                {loading ? (
                  <h5>loading sponsors</h5>
                ) : error || !data ? (
                  <h5> Error loading sponsors</h5>
                ) : (
                  <Select
                    defaultValue={getValues(`sponsors.${sponsorFieldId}.type`)}
                    {...registeredSponsor}
                    onChange={(e) => {
                      registeredSponsor.onChange(e);
                      const sponsorsForThisType = getAllowedSponsorsForType(
                        data,
                        e.target.value,
                        watchSponsorsArray,
                        sponsorFieldId,
                      );
                      setValue(
                        `sponsors.${sponsorFieldId}.id`,
                        sponsorsForThisType[0]?.id,
                      );
                    }}
                    isDisabled={loadingForm}
                  >
                    {getAllowedSponsorTypes(
                      data,
                      sponsorTypes,
                      watchSponsorsArray,
                      sponsorFieldId,
                    ).map((sponsorType) => (
                      <option key={sponsorType.type} value={sponsorType.type}>
                        {sponsorType.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>

              <FormControl m="1">
                <FormLabel>Sponsor Name</FormLabel>
                {loading ? (
                  <h5>loading sponsors</h5>
                ) : error || !data ? (
                  <h5> Error loading sponsors</h5>
                ) : (
                  <Select
                    defaultValue={getValues(`sponsors.${sponsorFieldId}.id`)}
                    {...register(`sponsors.${sponsorFieldId}.id` as const, {
                      required: false,
                      valueAsNumber: true,
                    })}
                    isDisabled={loadingForm}
                  >
                    {getAllowedSponsorsForType(
                      data,
                      watchSponsorsArray[sponsorFieldId].type,
                      watchSponsorsArray,
                      sponsorFieldId,
                    ).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Box>
            <CloseButton onClick={() => remove(sponsorFieldId)} />
          </Flex>
        );
      })}
    </FormControl>
  );
};

export default EventSponsorsForm;
