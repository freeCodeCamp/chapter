import * as React from 'react';
import SomeComponent from 'client/components/SomeComponent';

export default () => {
  return (
    <div>
      this is a page!
      <SomeComponent />
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
