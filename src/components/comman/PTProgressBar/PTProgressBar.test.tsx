/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTProgressBar from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
      textSecondary: '#666666',
      backgroundSecondary: '#F5F5F5',
    },
    spacing: {
      xs: 4,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTProgressBar', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(<PTProgressBar progress={50} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with percentage', () => {
    const tree = ReactTestRenderer.create(
      <PTProgressBar progress={75} showPercentage={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with different variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error'] as const;
    variants.forEach((variant) => {
      const tree = ReactTestRenderer.create(
        <PTProgressBar progress={50} variant={variant} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders correctly with custom height', () => {
    const tree = ReactTestRenderer.create(
      <PTProgressBar progress={50} height={16} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with 0 progress', () => {
    const tree = ReactTestRenderer.create(<PTProgressBar progress={0} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with 100 progress', () => {
    const tree = ReactTestRenderer.create(<PTProgressBar progress={100} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without animation', () => {
    const tree = ReactTestRenderer.create(
      <PTProgressBar progress={50} animated={false} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

