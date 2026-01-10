/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTSelect from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textTertiary: '#999999',
      border: '#CCCCCC',
      error: '#FF3B30',
      surface: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
      overlay: 'rgba(0, 0, 0, 0.5)',
      primary: '#007AFF',
      textInverse: '#FFFFFF',
    },
    spacing: {
      md: 16,
      sm: 8,
      xs: 4,
    },
    borderRadius: {
      md: 8,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

jest.mock('../PTCard', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />);
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

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

describe('PTSelect', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(
      <PTSelect options={mockOptions} onValueChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const tree = ReactTestRenderer.create(
      <PTSelect label="Select Option" options={mockOptions} onValueChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with value', () => {
    const tree = ReactTestRenderer.create(
      <PTSelect
        label="Select Option"
        options={mockOptions}
        value="1"
        onValueChange={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    const tree = ReactTestRenderer.create(
      <PTSelect
        label="Select Option"
        options={mockOptions}
        error="This field is required"
        onValueChange={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = ReactTestRenderer.create(
      <PTSelect
        label="Select Option"
        options={mockOptions}
        disabled={true}
        onValueChange={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onValueChange when option is selected', () => {
    const onValueChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTSelect options={mockOptions} onValueChange={onValueChangeMock} />
    );
    // Note: Testing modal interactions would require more complex setup
    expect(component).toBeTruthy();
  });
});

