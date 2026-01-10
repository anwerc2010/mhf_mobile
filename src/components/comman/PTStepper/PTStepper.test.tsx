/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTStepper from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textTertiary: '#999999',
      border: '#CCCCCC',
      surface: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
    },
    spacing: {
      md: 16,
      sm: 8,
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

describe('PTStepper', () => {
  it('renders correctly with default props', () => {
    const onValueChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTStepper value={5} onValueChange={onValueChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const onValueChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTStepper value={5} onValueChange={onValueChangeMock} label="Quantity" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly at minimum value', () => {
    const onValueChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTStepper value={0} min={0} onValueChange={onValueChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly at maximum value', () => {
    const onValueChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTStepper value={100} max={100} onValueChange={onValueChangeMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const onValueChangeMock = jest.fn();
    const tree = ReactTestRenderer.create(
      <PTStepper value={5} onValueChange={onValueChangeMock} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onValueChange when increment button is pressed', () => {
    const onValueChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTStepper value={5} onValueChange={onValueChangeMock} />
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    touchables[1].props.onPress(); // Increment button
    expect(onValueChangeMock).toHaveBeenCalledWith(6);
  });

  it('calls onValueChange when decrement button is pressed', () => {
    const onValueChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTStepper value={5} onValueChange={onValueChangeMock} />
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    touchables[0].props.onPress(); // Decrement button
    expect(onValueChangeMock).toHaveBeenCalledWith(4);
  });
});

