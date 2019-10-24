import * as React from 'react';
import { AddSponsor } from '../client/components';

const AddSponsorPage = () => {
  // TODO - Dynamically get Chapter and EventId s
  const eventId = '123abc';
  const chapterId = 'abc123';

  return (
    <div>
      <AddSponsor eventId={eventId} chapterId={chapterId} />
      <style jsx>{`
        div {
          width: 100vw;
          height: 100vh;
          background: skyblue;
        }
      `}</style>
    </div>
  );
};

export default AddSponsorPage;
