/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTSpinner from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
    },
  }),
}));

describe('PTSpinner', () => {
  it('renders correctly', () => {
    const tree = ReactTestRenderer.create(<PTSpinner />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

