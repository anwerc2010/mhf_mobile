/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTToast from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      success: '#34C759',
      error: '#FF3B30',
      info: '#007AFF',
      warning: '#FF9500',
      textInverse: '#FFFFFF',
    },
    spacing: {
      sm: 8,
      md: 16,
    },
    borderRadius: {
      md: 8,
    },
  }),
}));

jest.mock('../../../constants/config', () => ({
  UI_CONFIG: {
    TOAST_DURATION: 3000,
    ANIMATION_DURATION: 300,
  },
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTToast', () => {
  it('renders correctly when visible', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Toast message" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with success type', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Success message" type="success" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error type', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Error message" type="error" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with info type', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Info message" type="info" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with warning type', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Warning message" type="warning" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly at top position', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Toast message" position="top" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly at bottom position', () => {
    const tree = ReactTestRenderer.create(
      <PTToast visible={true} message="Toast message" position="bottom" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

