/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTBadge from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      textInverse: '#FFFFFF',
    },
    spacing: {
      xs: 4,
      sm: 8,
    },
    borderRadius: {
      full: 9999,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTBadge', () => {
  it('renders correctly with count', () => {
    const tree = ReactTestRenderer.create(<PTBadge count={5} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with string count', () => {
    const tree = ReactTestRenderer.create(<PTBadge count="10" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with maxCount exceeded', () => {
    const tree = ReactTestRenderer.create(<PTBadge count={150} maxCount={99} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with different variants', () => {
    const variants = ['primary', 'secondary', 'error', 'success', 'warning'] as const;
    variants.forEach((variant) => {
      const tree = ReactTestRenderer.create(
        <PTBadge count={5} variant={variant} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders correctly with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const tree = ReactTestRenderer.create(
        <PTBadge count={5} size={size} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('does not render when count is 0 and showZero is false', () => {
    const tree = ReactTestRenderer.create(<PTBadge count={0} />).toJSON();
    expect(tree).toBeNull();
  });

  it('renders when count is 0 and showZero is true', () => {
    const tree = ReactTestRenderer.create(<PTBadge count={0} showZero={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

