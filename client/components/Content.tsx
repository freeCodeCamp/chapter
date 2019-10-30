import * as React from 'react';
import styled from 'styled-components';

const ContentArea = styled.main`
  grid-area: content;
  min-height: calc(100vh - 140px);
`;

const Title = styled.main`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Content = () => (
  <ContentArea>
    <Title>This is a page with a Styled Title!</Title>
    <p>This is an imported component</p>
  </ContentArea>
);

export default Content;
