import * as React from 'react';
import Layout from '../client/components/Layout';
import styled from 'styled-components';

const Main = styled.main`
  grid-area: content;
  min-height: calc(100vh - 140px);
`;

const Title = styled.main`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

const About = () => (
  <Layout>
    <Main>
      <Title>This is a page with a Styled Title!</Title>
      <p>This is an imported component</p>
    </Main>
  </Layout>
);

export default About;
