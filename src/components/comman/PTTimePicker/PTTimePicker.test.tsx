/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTTimePicker from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#CCCCCC',
      error: '#FF3B30',
      surface: '#FFFFFF',
    },
    spacing: {
      lg: 24,
      md: 16,
      sm: 8,
      xs: 4,
    },
  }),
}));

jest.mock('../PTInput', () => {
  const React = require('react');
  const { TextInput, View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <View>
      <TextInput ref={ref} {...props} />
    </View>
  ));
});

jest.mock('../PTModal', () => {
  const React = require('react');
  const { Modal, View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <Modal visible={props.visible}>
      <View>{props.children}</View>
    </Modal>
  ));
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

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTTimePicker', () => {
  it('renders correctly with default props', () => {
    const onTimeChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTTimePicker onTimeChange={onTimeChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const onTimeChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTTimePicker label="Select Time" onTimeChange={onTimeChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with 24h format', () => {
    const onTimeChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTTimePicker onTimeChange={onTimeChangeMock} format="24h" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with value', () => {
    const onTimeChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTTimePicker onTimeChange={onTimeChangeMock} value={{ hour: 14, minute: 30 }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const onTimeChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTTimePicker onTimeChange={onTimeChangeMock} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

