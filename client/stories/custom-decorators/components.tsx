import React from 'react';

export const GridContainer = ({ style, cols = 4, children }) => {
  const columns = `${100 / cols}% `.repeat(cols);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns,
        gridGap: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
