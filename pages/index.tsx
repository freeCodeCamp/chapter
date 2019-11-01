import * as React from 'react';
import Layout from '../client/components/Layout';
import styled from 'styled-components';

const Main = styled.main`
  grid-area: content;
  min-height: calc(100vh - 140px);
`;


export default () => {
  return (
    <Layout>
      <Main>Home page</Main>
    </Layout>
    <div>
      <SomeComponent />
    </div>
  );
};
