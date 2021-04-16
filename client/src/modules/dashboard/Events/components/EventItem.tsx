import React, { useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import Link from 'next/link';

import { Event, Tag } from '../../../../generated';
import { ProgressCardContent } from '../../../../components';
import Tags from './Tag';
import Actions from './Actions';

import DateRangeIcon from '@material-ui/icons/DateRange';
import RoomIcon from '@material-ui/icons/Room';
import Button from '@material-ui/core/Button';

import TabPanel from './utility/TabPanel';
interface EventItemProps {
  event: Pick<
    Event,
    | 'id'
    | 'name'
    | 'description'
    | 'url'
    | 'video_url'
    | 'capacity'
    | 'canceled'
  > & { tags?: Pick<Tag, 'id' | 'name'>[] | null };
  loading: boolean;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('en-US');
};

const EventItem: React.FC<EventItemProps> = ({ loading, event }) => {
  const [selectedTabPanel, setSelectedTabPanel] = useState(-1);

  const handleTabPanelChange = (value: number) => {
    if (selectedTabPanel === value) {
      setSelectedTabPanel(-1);
    } else {
      setSelectedTabPanel(value);
    }
  };

  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <div className="event-card">
          <div className="flex-row title">
            <div>
              <Link
                href="/dashboard/events/[id]"
                as={`/dashboard/events/${event.id}`}
              >
                <Typography variant="h5" component="h2">
                  {event.name}
                </Typography>
              </Link>
              <Typography variant="subtitle1" component="h3">
                by {'Chapter Name'}
              </Typography>
            </div>

            {event.canceled && (
              <Typography variant="h5" component="h2" color="error">
                Canceled
              </Typography>
            )}
          </div>

          {event.tags && (
            <div className="tags flex-row">
              <Tags tags={event.tags} />
            </div>
          )}

          <div className="flex-row icon-group">
            <DateRangeIcon />
            <div className="date-range">
              <Typography variant="body2" component="div">
                {formatDate(event.start_at)}
              </Typography>
              <Typography variant="body2" component="div">
                {formatDate(event.ends_at)}
              </Typography>
            </div>
          </div>

          <div className="flex-row icon-group">
            <RoomIcon />
            <div className="venue">
              <Typography
                variant="subtitle2"
                component="strong"
                className="name"
              >
                {event.venue.name}
              </Typography>
              <Typography variant="body2" component="p">
                {[
                  event.venue.street_address,
                  event.venue.city,
                  event.venue.region,
                  event.venue.country,
                ]
                  .filter((e) => !!e)
                  .map((e, i) => (
                    <span key={i}>{(i === 0 ? '' : ', ') + e}</span>
                  ))}
              </Typography>
            </div>
          </div>

          <div className="actions flex-row">
            <Actions event={event} />

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleTabPanelChange(0)}
            >
              Know More
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleTabPanelChange(1)}
            >
              RSVP
            </Button>
          </div>

          <TabPanel value={selectedTabPanel} index={0}>
            <Typography variant="body2" component="p">
              {event.description}
            </Typography>
            {event.url && (
              <Typography variant="body2" component="p">
                Event Url: <a href={event.url}>{event.url}</a>
              </Typography>
            )}
            {event.video_url && (
              <Typography variant="body2" component="p">
                Video Url: <a href={event.video_url}>{event.video_url}</a>
              </Typography>
            )}
            <Typography variant="body2" component="p">
              {event.capacity}
            </Typography>
          </TabPanel>

          <TabPanel value={selectedTabPanel} index={1}>
            <Typography variant="subtitle2" component="strong">
              RSVP
            </Typography>
          </TabPanel>
        </div>
      </ProgressCardContent>
    </Card>
  );
};

export default EventItem;
