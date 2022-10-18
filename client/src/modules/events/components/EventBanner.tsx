import Image from 'next/image';
import React from 'react';
import '../../../styles/EventBanner.module.css';

const defaultBanner = '';

export const EventBanner = ({ BannerUrl }: { BannerUrl: string }) => {
  return (
    <Image
      data-cy="event-image"
      src={BannerUrl}
      alt=""
      className="event-banner"
      onError={() => (BannerUrl = defaultBanner)}
      layout="fill"
    />
  );
};

{
  /* <Image
        data-cy="event-image"
        boxSize="100%"
        maxH="300px"
        src={data.event.image_url}
        alt=""
        borderRadius="md"
        objectFit="cover"
      /> */
}
