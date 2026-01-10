/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTAvatar from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      primaryLight: '#E3F2FD',
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTAvatar', () => {
  it('renders correctly with name', () => {
    const tree = ReactTestRenderer.create(<PTAvatar name="John Doe" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with single name', () => {
    const tree = ReactTestRenderer.create(<PTAvatar name="John" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with image source', () => {
    const tree = ReactTestRenderer.create(
      <PTAvatar source={{ uri: 'https://example.com/avatar.jpg' }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with different sizes', () => {
    const tree = ReactTestRenderer.create(<PTAvatar name="John Doe" size={60} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with different variants', () => {
    const variants = ['circle', 'rounded', 'square'] as const;
    variants.forEach((variant) => {
      const tree = ReactTestRenderer.create(
        <PTAvatar name="John Doe" variant={variant} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders correctly without name or source', () => {
    const tree = ReactTestRenderer.create(<PTAvatar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

