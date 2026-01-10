/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTImagePicker from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#CCCCCC',
      error: '#FF3B30',
      textInverse: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
    },
    spacing: {
      md: 16,
      sm: 8,
      xs: 4,
    },
    borderRadius: {
      md: 8,
      full: 9999,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

jest.mock('../PTButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <TouchableOpacity ref={ref} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  ));
});

describe('PTImagePicker', () => {
  it('renders correctly with default props', () => {
    const onImageSelectMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTImagePicker onImageSelect={onImageSelectMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const onImageSelectMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTImagePicker label="Profile Image" onImageSelect={onImageSelectMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with image', () => {
    const onImageSelectMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTImagePicker
        value="https://example.com/image.jpg"
        onImageSelect={onImageSelectMock}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const onImageSelectMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTImagePicker onImageSelect={onImageSelectMock} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    const onImageSelectMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTImagePicker onImageSelect={onImageSelectMock} error="Image is required" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

