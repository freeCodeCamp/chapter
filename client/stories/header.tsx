import React from 'react';
import { withActions } from '@storybook/addon-actions';
import Header from 'client/ui/header';

export default {
  title: 'Header',
  decorator: [withActions],
};

export const basic = () => <Header />;
