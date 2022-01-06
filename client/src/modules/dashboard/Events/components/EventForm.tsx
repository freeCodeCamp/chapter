import {
  VStack,
  Checkbox,
  Button,
  FormLabel,
  FormControl,
  Select,
  Box,
  Spacer,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import {
  useSponsorsQuery,
  useVenuesQuery,
} from '../../../../generated/graphql';
import {
  EventFormProps,
  fields,
  formatValue,
  EventFormData,
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
      tags: (data.tags || []).map((t) => t.name).join(', '),
      venue_id: data.venue_id,
      image_url: data.image_url,
    };
  }, []);

  const { register, control, handleSubmit, watch, setValue, getValues } =
    useForm<EventFormData>({
      defaultValues,
    });

  const {
    fields: sponsors,
    append,
    remove,
  } = useFieldArray({
    name: 'sponsors',
    keyName: 'key',
    control,
  });

  const watchSponsorsArray = watch('sponsors');
  const inviteOnly = watch('invite_only');
  const firstSponsorType = sponsorData?.sponsors[0]?.type as string | undefined;
  const firstSponsorId = sponsorData?.sponsors[0]?.id as number | undefined;
  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}
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
                append({
                  type: firstSponsorType,
                  id: firstSponsorId,
                });
              }}
            >
              Add
            </Button>
          </Box>
          {sponsors.map((sponsor, index) => {
            const registeredSponsor = register(
              `sponsors.${index}.type` as const,
              {
                required: true,
              },
            );

            return (
              <Flex key={sponsor.key} borderWidth="1px" p="5" mb="5">
                <Box display="flex" flexGrow={1}>
                  <FormControl m="1">
                    <FormLabel>Sponsor Type</FormLabel>
                    <Select
                      defaultValue={getValues(`sponsors.${index}.type`)}
                      {...registeredSponsor}
                      onChange={(e) => {
                        registeredSponsor.onChange(e);
                        const sponsorsForThisType =
                          sponsorData?.sponsors.filter(
                            (s) => s.type === e.target.value,
                          ) ?? [];
                        setValue(
                          `sponsors.${index}.id`,
                          sponsorsForThisType[0]?.id,
                        );
                      }}
                    >
                      <option value="FOOD">Food</option>
                      <option value="VENUE">Venue</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </FormControl>

                  <FormControl m="1">
                    <FormLabel> Sponsor Name</FormLabel>
                    {loadingSponsors ? (
                      <h5>loading sponsors</h5>
                    ) : errorSponsor || !sponsorData ? (
                      <h5> Error loading sponsors</h5>
                    ) : (
                      <Select
                        defaultValue={getValues(`sponsors.${index}.id`)}
                        {...register(`sponsors.${index}.id` as const, {
                          required: true,
                          valueAsNumber: true,
                        })}
                      >
                        {sponsorData.sponsors
                          ?.filter((sponsor) => {
                            const isRightSponsorType =
                              sponsor.type === watchSponsorsArray[index]?.type;
                            if (!isRightSponsorType) {
                              return false;
                            }
                            const selectionIndex = watchSponsorsArray.findIndex(
                              (selectedSponsor) =>
                                selectedSponsor.id === sponsor.id,
                            );
                            const sponsorNotSelectedElsewhere =
                              selectionIndex === -1 || selectionIndex === index;
                            return sponsorNotSelectedElsewhere;
                          })
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
                <CloseButton onClick={() => remove(index)} />
              </Flex>
            );
          })}
        </FormControl>
        <Button
          width="100%"
          colorScheme="blue"
          type="submit"
          isDisabled={loading}
        >
          {submitText}
        </Button>
      </VStack>
    </form>
  );
};

export default EventForm;
