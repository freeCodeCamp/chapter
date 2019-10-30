import * as React from 'react';
import styled from 'styled-components';

const Foot = styled.footer`
  grid-area: footer;
  background-color: darkslategray;
  color: white;
`;

const Footer = () => <Foot>Footer - Disclaimer/copyright. etc. </Foot>;

export default Footer;
