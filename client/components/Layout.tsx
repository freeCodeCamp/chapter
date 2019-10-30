import * as React from 'react';
import Header from 'client/components/Header';
import Sidebar from 'client/components/Sidebar';
import Footer from 'client/components/Footer';
import styled from 'styled-components';

const Site = styled.div`
  @supports not (display: grid) {
    max-width: 90vw;
    margin: 0 auto;
  }
  @media screen and (min-width: 600px) {
    @supports (display: grid) {
      display: grid;
      grid-template-columns: 1fr 4fr;
      grid-template-rows: 60px 1fr 80px;

      grid-template-areas:
        'sidebar header'
        'sidebar content'
        'footer footer';
    }
  }
`;

export default ({ children }) => (
  <Site>
    <Header />
    <Sidebar />
    {children}
    <Footer />
  </Site>
);
