import * as React from 'react';
import styled from 'styled-components';

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: solid 1px black;
`;

const Sidebar = () => <Aside>Popout admin dashboard, or user links etc.</Aside>;

export default Sidebar;
