import {
  ComponentWithAs,
  IconProps,
  List,
  ListIcon,
  ListItem,
  ListItemProps,
  ListProps,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import React from 'react';

type InfoListProps = {
  items: string[];
  itemsWithCustomIcon?: {
    text: string;
    Icon?: ComponentWithAs<'svg', IconProps>;
  }[];
  iconProps?: IconProps;
  listProps?: ListProps;
  listItemProps?: ListItemProps;
};

export const InfoList = ({
  items,
  itemsWithCustomIcon,
  iconProps,
  listProps,
  listItemProps,
}: InfoListProps) => {
  return (
    <List {...listProps}>
      {items.map((text) => (
        <ListItem key={text} {...listItemProps}>
          <ListIcon as={InfoIcon} boxSize={5} {...iconProps} />
          {text}
        </ListItem>
      ))}
      {itemsWithCustomIcon?.map(({ text, Icon }) => (
        <ListItem key={text} {...listItemProps}>
          <ListIcon as={Icon ? Icon : InfoIcon} boxSize={5} {...iconProps} />
          {text}
        </ListItem>
      ))}
    </List>
  );
};
