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
  RadioGroup,
  Radio,
  Heading,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import {
  useChapterQuery,
  useSponsorsQuery,
  useVenuesQuery,
  VenueType,
} from '../../../../generated/graphql';
import styles from '../../../../styles/Form.module.css';
import { isOnline, isPhysical } from '../../../../util/venueType';
import EventCancelButton from './EventCancelButton';
import {
  EventFormProps,
  fields,
  EventFormData,
  sponsorTypes,
  venueTypes,
  getAllowedSponsors,
  getAllowedSponsorTypes,
  getAllowedSponsorsForType,
} from './EventFormUtils';

import 'react-datepicker/dist/react-datepicker.css';

const EventForm: React.FC<EventFormProps> = (props) => {
  const { onSubmit, data, loading, submitText, chapterId } = props;
  const {
    loading: loadingChapter,
    error: errorChapter,
    data: dataChapter,
  } = useChapterQuery({
    variables: { chapterId },
  });
  const {
    loading: loadingVenues,
    error: errorVenues,
    data: dataVenues,
  } = useVenuesQuery();

  const {
    loading: loadingSponsors,
    error: errorSponsor,
    data: sponsorData,
  } = useSponsorsQuery();

  const defaultValues = useMemo(() => {
    if (!data) {
      return {
        start_at: new Date(),
        ends_at: new Date(),
        venue_type: VenueType.PhysicalAndOnline,
      };
    }
    return {
      name: data.name,
      description: data.description,
      url: data.url,
      streaming_url: data.streaming_url,
      capacity: data.capacity,
      start_at: data.start_at,
      ends_at: data.ends_at,
      sponsors: data.sponsors,
      tags: (data.tags || []).map(({ tag }) => tag.name).join(', '),
      venue_type: data.venue_type,
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
  const venueType = watch('venue_type');

  const [startDate, setStartDate] = useState<Date>(
    new Date(defaultValues.start_at),
  );
  const [endDate, setEndDate] = useState<Date>(new Date(defaultValues.ends_at));
  const onDatePickerChange = useCallback(
    (key: string) => {
      return (date: Date | null) => {
        if (key === 'start_at' && date) {
          setValue('start_at', date);
          setStartDate(date);
        } else if (key === 'ends_at' && date) {
          setValue('ends_at', date);
          setEndDate(date);
        }
      };
    },
    [setValue, setStartDate],
  );
  return (
    <>
      {loadingChapter ? (
        <Text>Loading Chapter</Text>
      ) : errorChapter || !dataChapter?.chapter ? (
        <Text>Error loading chapter</Text>
      ) : (
        <Heading>{dataChapter.chapter.name}</Heading>
      )}
      <form
        aria-label={submitText}
        onSubmit={handleSubmit((data) => onSubmit(data, chapterId))}
        className={styles.form}
      >
        <VStack align="flex-start">
          {fields.map((field) =>
            field.type === 'datetime' ? (
              <FormControl key={field.key} isRequired>
                <DatePicker
                  selected={field.key === 'start_at' ? startDate : endDate}
                  showTimeSelect
                  timeIntervals={5}
                  onChange={onDatePickerChange(field.key)}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={
                    <Input
                      id={`${field.key}_trigger`}
                      name={`${field.key}`}
                      label={field.label}
                      value={
                        field.key === 'start_at'
                          ? startDate.toDateString()
                          : endDate.toDateString()
                      }
                    />
                  }
                />
              </FormControl>
            ) : field.type === 'textarea' ? (
              <TextArea
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                isRequired={field.isRequired}
                {...register(field.key)}
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

          <FormControl isRequired>
            <FormLabel>Venue Type</FormLabel>
            <RadioGroup defaultValue={venueType}>
              <HStack>
                {venueTypes.map((venueType) => (
                  <Radio
                    key={venueType.value}
                    value={venueType.value}
                    {...register('venue_type')}
                  >
                    {venueType.name}
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>

            {loadingVenues ? (
              <h1>Loading venues...</h1>
            ) : errorVenues || !dataVenues ? (
              <h1>Error loading venues</h1>
            ) : (
              isPhysical(getValues('venue_type')) && (
                <FormControl isRequired>
                  <FormLabel>Venue</FormLabel>
                  <Select {...register('venue_id')}>
                    {dataVenues.venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )
            )}

            {isOnline(getValues('venue_type')) && (
              <Input
                key="streaming url"
                type="url"
                label="Streaming URL"
                placeholder=""
                isRequired
                {...register('streaming_url')}
              />
            )}
          </FormControl>

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
                            const sponsorsForThisType =
                              getAllowedSponsorsForType(
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
                          {...register(
                            `sponsors.${sponsorFieldId}.id` as const,
                            {
                              required: true,
                              valueAsNumber: true,
                            },
                          )}
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
              width="full"
              colorScheme="blue"
              type="submit"
              isDisabled={loading}
              mb="4"
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
    </>
  );
};

export default EventForm;
