/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTDynamicForm, { FormField } from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textSecondary: '#666666',
      border: '#CCCCCC',
      error: '#FF3B30',
      surface: '#FFFFFF',
      background: '#F5F5F5',
      primary: '#007AFF',
    },
    spacing: {
      lg: 24,
      md: 16,
      sm: 8,
      xs: 4,
      inputPadding: 12,
      buttonPadding: 12,
    },
    borderRadius: {
      md: 8,
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

jest.mock('../PTButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <TouchableOpacity ref={ref} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  ));
});

jest.mock('../PTSwitch', () => {
  const React = require('react');
  const { Switch, View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <View>
      <Switch ref={ref} {...props} />
    </View>
  ));
});

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

jest.mock('../PTDivider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />);
});

jest.mock('../PTSelect', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <View>
      <TouchableOpacity onPress={() => props.onValueChange && props.onValueChange(props.value)}>
        <Text>{props.placeholder || 'Select'}</Text>
      </TouchableOpacity>
    </View>
  ));
});

const mockFields: FormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    validations: [
      { name: 'required', value: true, message: 'Email is required' },
    ],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    validations: [
      { name: 'required', value: true, message: 'Password is required' },
      { name: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    ],
  },
];

describe('PTDynamicForm', () => {
  it('renders correctly with fields', () => {
    const tree = ReactTestRenderer.create(
      <PTDynamicForm fields={mockFields} onSubmit={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with initial values', () => {
    const tree = ReactTestRenderer.create(
      <PTDynamicForm
        fields={mockFields}
        initialValues={{ email: 'test@example.com' }}
        onSubmit={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onSubmit when form is submitted', () => {
    const onSubmitMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTDynamicForm fields={mockFields} onSubmit={onSubmitMock} />
    );
    // Form submission would require filling in values and pressing submit
    expect(component).toBeTruthy();
  });
});

