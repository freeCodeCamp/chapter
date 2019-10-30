import * as React from 'react';
import styled from 'styled-components';

const Head = styled.header`
  grid-area: header;
  background-color: salmon;
  color: white;
`;

const Header = () => (
  <Head>Header - Nav/Logo could go here or something. </Head>
);

export default Header;
