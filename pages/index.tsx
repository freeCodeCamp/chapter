import * as React from 'react';
import SomeComponent from 'client/components/SomeComponent';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Index = () => {
  return (
    <div>
      <Title>This is a page with a Styled Title!</Title>
      <SomeComponent />
    </div>
  );
};

export default Index;
