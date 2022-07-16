import { Tabs, TabList, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

interface Props {
  TabHeading: React.ReactNode;
  TabContent: React.ReactNode;
}

export const SettingTab = ({ TabHeading, TabContent }: Props) => {
  return (
    <Tabs>
      <TabList>
        <Tab>{TabHeading}</Tab>
      </TabList>
      <TabPanel>{TabContent}</TabPanel>
    </Tabs>
  );
};
