/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTInput from './index';

// Mock the useTheme hook
jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textTertiary: '#999999',
      border: '#CCCCCC',
      error: '#FF3B30',
      surface: '#FFFFFF',
    },
    spacing: {
      md: 16,
      sm: 8,
      xs: 4,
      inputPadding: 12,
    },
    borderRadius: {
      md: 8,
    },
  }),
}));

// Mock PTText
jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTInput', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(
      <PTInput placeholder="Enter text" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const tree = ReactTestRenderer.create(
      <PTInput label="Email" placeholder="Enter email" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    const tree = ReactTestRenderer.create(
      <PTInput label="Email" error="Invalid email" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = ReactTestRenderer.create(
      <PTInput label="Email" editable={false} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with value', () => {
    const tree = ReactTestRenderer.create(
      <PTInput label="Email" value="test@example.com" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTInput label="Email" onChangeText={onChangeTextMock} />
    );
    const instance = component.root;
    const input = instance.findByType('TextInput');
    input.props.onChangeText('new text');
    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });
});

