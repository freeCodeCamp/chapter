import {
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import {
  useChapterQuery,
  useChapterVenuesQuery,
  useSponsorsQuery,
  VenueType,
} from '../../../../generated/graphql';
import styles from '../../../../styles/Form.module.css';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { useAuth } from '../../../auth/store';
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
  const {
    onSubmit,
    data,
    loading,
    submitText,
    chapterId: initialChapterId,
    loadingText,
  } = props;
  const isChaptersDropdownNeeded = initialChapterId === -1;
  const {
    loading: loadingChapter,
    error: errorChapter,
    data: dataChapter,
  } = useChapterQuery({
    variables: { chapterId: initialChapterId },
  });

  interface Chapter {
    id: number;
    name: string;
  }

  let adminedChapters: Chapter[] = [];
  if (isChaptersDropdownNeeded) {
    const { user } = useAuth();
    adminedChapters = user?.admined_chapters ?? [];
  }

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
        chapter_id: initialChapterId,
      };
    }
    return {
      name: data.name,
      description: data.description,
      url: data.url,
      streaming_url: data.streaming_url,
      capacity: data.capacity,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      sponsors: data.sponsors,
      tags: (data.tags || []).map(({ tag }) => tag.name).join(', '),
      venue_type: data.venue_type,
      venue_id: data.venue_id,
      image_url: data.image_url,
      invite_only: data.invite_only,
      chapter_id: initialChapterId,
    };
  }, []);

  const {
    control,
    formState: { isDirty },
    getValues,
    handleSubmit,
    register,
    resetField,
    setValue,
    watch,
  } = useForm<EventFormData>({
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
  const chapterId = watch('chapter_id');

  const {
    loading: loadingVenues,
    error: errorVenues,
    data: dataVenues,
  } = useChapterVenuesQuery({ variables: { chapterId } });

  useEffect(() => {
    resetField('chapter_id', { defaultValue: adminedChapters[0]?.id ?? -1 });
  }, [adminedChapters]);

  useEffect(() => {
    resetField('venue_id', {
      defaultValue:
        defaultValues.venue_id ?? dataVenues?.chapterVenues[0]?.id ?? -1,
    });
  }, [dataVenues]);

  const [startDate, setStartDate] = useState<Date>(
    new Date(defaultValues.start_at),
  );
  const [endDate, setEndDate] = useState<Date>(new Date(defaultValues.ends_at));
  const onDatePickerChange = useCallback(
    (key: string) => {
      return (date: Date | null) => {
        if (!date) return;
        if (key === 'start_at' || date < getValues('start_at')) {
          setValue('start_at', date, { shouldDirty: true });
          setStartDate(date);
        }
        if (key === 'ends_at' || date > getValues('ends_at')) {
          setValue('ends_at', date, { shouldDirty: true });
          setEndDate(date);
        }
      };
    },
    [setValue, setStartDate],
  );

  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <Flex
        flexDirection={'column'}
        align="flex-start"
        gap={4}
        marginBlock={'1em'}
      >
        {!isChaptersDropdownNeeded || data ? (
          loadingChapter ? (
            <Text>Loading Chapter</Text>
          ) : errorChapter || !dataChapter?.chapter ? (
            <Text>Error loading chapter</Text>
          ) : (
            <Heading>{dataChapter.chapter.name}</Heading>
          )
        ) : (
          <FormControl isRequired>
            <FormLabel>Chapter</FormLabel>
            <Select
              {...register('chapter_id' as const, {
                required: true,
                valueAsNumber: true,
              })}
              isDisabled={loading}
            >
              {adminedChapters.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {fields.map((field) =>
          field.type === 'datetime' ? (
            <FormControl key={field.key} isRequired>
              <DatePicker
                selected={field.key === 'start_at' ? startDate : endDate}
                showTimeSelect
                timeIntervals={5}
                onChange={onDatePickerChange(field.key)}
                disabled={loading}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={
                  <Input
                    id={`${field.key}_trigger`}
                    name={`${field.key}`}
                    label={field.label}
                    isDisabled={loading}
                    isRequired={field.isRequired}
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
              isDisabled={loading}
              {...register(field.key)}
            />
          ) : (
            <Input
              key={field.key}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              isRequired={field.isRequired}
              isDisabled={loading}
              {...register(field.key)}
            />
          ),
        )}

        <Checkbox
          data-cy="invite-only-checkbox"
          isChecked={inviteOnly}
          disabled={loading}
          {...register('invite_only')}
        >
          Invite only
        </Checkbox>

        <FormControl marginBlock={'1em'}>
          <FormLabel>Venue Type</FormLabel>
          <RadioGroup defaultValue={venueType}>
            <HStack>
              {venueTypes.map((venueType) => (
                <Radio
                  key={venueType.value}
                  value={venueType.value}
                  isDisabled={loading}
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
              <FormControl marginBlock={'1em'}>
                <FormLabel>Venue</FormLabel>
                <Select {...register('venue_id')} isDisabled={loading}>
                  {dataVenues.chapterVenues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )
          )}

          <Box marginTop={'1em'}>
            {isOnline(getValues('venue_type')) && (
              <Input
                key="streaming url"
                type="url"
                label="Streaming URL"
                placeholder=""
                isDisabled={loading}
                {...register('streaming_url')}
              />
            )}
          </Box>
        </FormControl>

        <FormControl id="first-name" marginBottom={'1em'}>
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
                loading ||
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
                required: false,
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
                        isDisabled={loading}
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
                          required: false,
                          valueAsNumber: true,
                        })}
                        isDisabled={loading}
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
        <HStack width="100%" mb="10 !important">
          <Button
            width="full"
            colorScheme="blue"
            type="submit"
            isDisabled={!isDirty || loading}
            isLoading={loading}
            loadingText={loadingText}
          >
            {submitText}
          </Button>
          {data && !data.canceled && (
            <EventCancelButton
              isFullWidth={true}
              event={data}
              isDisabled={loading}
              buttonText="Cancel this Event"
            />
          )}
        </HStack>
      </Flex>
    </form>
  );
};

export default EventForm;
