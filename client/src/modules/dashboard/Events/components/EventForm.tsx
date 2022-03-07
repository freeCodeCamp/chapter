import {
  VStack,
  HStack,
  Checkbox,
  Button,
  FormLabel,
  FormControl,
  Select,
  Box,
  Spacer,
  CloseButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import {
  useSponsorsQuery,
  useVenuesQuery,
} from '../../../../generated/graphql';
import styles from '../../../../styles/Form.module.css';
import EventCancelButton from './EventCancelButton';
import {
  EventFormProps,
  fields,
  formatValue,
  EventFormData,
  sponsorTypes,
  getAllowedSponsors,
  getAllowedSponsorTypes,
  getAllowedSponsorsForType,
} from './EventFormUtils';

const EventForm: React.FC<EventFormProps> = (props) => {
  const { onSubmit, data, loading, submitText } = props;
  const {
    loading: loadingVenues,
    error: errorVenus,
    data: dataVenues,
  } = useVenuesQuery();

  const {
    loading: loadingSponsors,
    error: errorSponsor,
    data: sponsorData,
  } = useSponsorsQuery();

  const defaultValues = useMemo(() => {
    if (!data)
      return {
        start_at: new Date().toISOString().slice(0, 16),
        ends_at: new Date(Date.now() + 1000 * 60 * 60)
          .toISOString()
          .slice(0, 16),
      };
    return {
      name: data.name,
      description: data.description,
      url: data.url,
      streaming_url: data.streaming_url,
      capacity: data.capacity,
      start_at: new Date(data.start_at).toISOString().slice(0, 16),
      ends_at: new Date(data.ends_at).toISOString().slice(0, 16),
      sponsors: data.sponsors,
      tags: (data.tags || []).map(({ tag }) => tag.name).join(', '),
      venue_id: data.venue_id,
      image_url: data.image_url,
      invite_only: data.invite_only,
    };
  }, []);

  const { register, control, handleSubmit, watch, setValue, getValues } =
    useForm<EventFormData>({
      defaultValues,
    });

  const {
    fields: sponsorFields,
    append,
    remove,
  } = useFieldArray({
    name: 'sponsors',
    keyName: 'key',
    control,
  });

  const watchSponsorsArray = watch('sponsors');
  const inviteOnly = watch('invite_only');
  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <VStack align="flex-start">
        {fields.map((field) =>
          field.type === 'textarea' ? (
            <TextArea
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              isRequired={field.isRequired}
              {...register(field.key)}
              defaultValue={formatValue(field, data)}
            />
          ) : (
            <Input
              key={field.key}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              isRequired={field.isRequired}
              {...register(field.key)}
            />
          ),
        )}

        <Checkbox
          data-cy="invite-only-checkbox"
          isChecked={inviteOnly}
          onChange={(e) => setValue('invite_only', e.target.checked)}
        >
          Invite only
        </Checkbox>

        {loadingVenues ? (
          <h1>Loading venues...</h1>
        ) : errorVenus || !dataVenues ? (
          <h1>Error loading venues</h1>
        ) : (
          <FormControl>
            <FormLabel>Venue</FormLabel>
            <Select {...register('venue_id')}>
              {dataVenues.venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}

              <option>None</option>
            </Select>
          </FormControl>
        )}

        <FormControl id="first-name" isRequired>
          <Box display="flex" alignItems="end" m="1">
            <FormLabel> Sponsors</FormLabel>
            <Spacer />
            <Button
              onClick={() => {
                if (sponsorData) {
                  const allowedSponsors = getAllowedSponsors(
                    sponsorData,
                    watchSponsorsArray,
                  );
                  append({
                    type: allowedSponsors[0]?.type,
                    id: allowedSponsors[0]?.id,
                  });
                }
              }}
              isDisabled={
                loadingSponsors ||
                errorSponsor ||
                !sponsorData ||
                sponsorFields.length < sponsorData.sponsors.length
                  ? false
                  : true
              }
            >
              Add
            </Button>
          </Box>
          {sponsorFields.map((sponsorField, sponsorFieldId) => {
            const registeredSponsor = register(
              `sponsors.${sponsorFieldId}.type` as const,
              {
                required: true,
              },
            );

            return (
              <Flex key={sponsorField.key} borderWidth="1px" p="5" mb="5">
                <Box display="flex" flexGrow={1}>
                  <FormControl m="1">
                    <FormLabel>Sponsor Type</FormLabel>
                    {loadingSponsors ? (
                      <h5>loading sponsors</h5>
                    ) : errorSponsor || !sponsorData ? (
                      <h5> Error loading sponsors</h5>
                    ) : (
                      <Select
                        defaultValue={getValues(
                          `sponsors.${sponsorFieldId}.type`,
                        )}
                        {...registeredSponsor}
                        onChange={(e) => {
                          registeredSponsor.onChange(e);
                          const sponsorsForThisType = getAllowedSponsorsForType(
                            sponsorData,
                            e.target.value,
                            watchSponsorsArray,
                            sponsorFieldId,
                          );
                          setValue(
                            `sponsors.${sponsorFieldId}.id`,
                            sponsorsForThisType[0]?.id,
                          );
                        }}
                      >
                        {getAllowedSponsorTypes(
                          sponsorData,
                          sponsorTypes,
                          watchSponsorsArray,
                          sponsorFieldId,
                        ).map((sponsorType) => (
                          <option
                            key={sponsorType.type}
                            value={sponsorType.type}
                          >
                            {sponsorType.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  <FormControl m="1">
                    <FormLabel> Sponsor Name</FormLabel>
                    {loadingSponsors ? (
                      <h5>loading sponsors</h5>
                    ) : errorSponsor || !sponsorData ? (
                      <h5> Error loading sponsors</h5>
                    ) : (
                      <Select
                        defaultValue={getValues(
                          `sponsors.${sponsorFieldId}.id`,
                        )}
                        {...register(`sponsors.${sponsorFieldId}.id` as const, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      >
                        {getAllowedSponsorsForType(
                          sponsorData,
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
        {data?.canceled && <Text color="red.500">Event canceled</Text>}
        <HStack width="100%">
          <Button
            isFullWidth={true}
            colorScheme="blue"
            type="submit"
            isDisabled={loading}
          >
            {submitText}
          </Button>
          {data && !data.canceled && (
            <EventCancelButton
              isFullWidth={true}
              event={data}
              buttonText="Cancel this Event"
            />
          )}
        </HStack>
      </VStack>
    </form>
  );
};

export default EventForm;
