import * as React from 'react';
import SomeComponent from 'client/components/SomeComponent';

const Index = () => {
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

export default Index;
