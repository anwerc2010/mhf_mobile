/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTDatePicker from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      primaryLight: '#E3F2FD',
      text: '#000000',
      textSecondary: '#666666',
      border: '#CCCCCC',
      error: '#FF3B30',
      surface: '#FFFFFF',
    },
    spacing: {
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
    <TouchableOpacity ref={ref} onPress={props.onPress} disabled={props.disabled}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  ));
});

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTDatePicker', () => {
  it('renders correctly with default props', () => {
    const onDateChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTDatePicker onDateChange={onDateChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const onDateChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTDatePicker label="Select Date" onDateChange={onDateChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with value', () => {
    const onDateChangeMock = jest.fn();
    const date = new Date('2024-01-15');
    const tree = ReactTestRenderer.create(
      <PTDatePicker value={date} onDateChange={onDateChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const onDateChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTDatePicker onDateChange={onDateChangeMock} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    const onDateChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTDatePicker onDateChange={onDateChangeMock} error="Date is required" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

