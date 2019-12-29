import React from 'react';

export const withFixedWidth = (styles = {}) => (storyFn: Function) => {
  return (
    <div
      style={{
        padding: 32,
        width: 400,
        backgroundColor: '#999',
        ...styles,
      }}
    >
      {storyFn()}
    </div>
  );
};
