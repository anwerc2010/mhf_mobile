/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTButton from './index';

// Mock the useTheme hook
jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      textInverse: '#FFFFFF',
    },
    spacing: {
      buttonPadding: 12,
      lg: 16,
    },
    borderRadius: {
      md: 8,
    },
  }),
}));

describe('PTButton', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Test Button" onPress={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with loading state', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Loading Button" onPress={() => {}} loading={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Disabled Button" onPress={() => {}} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with primary variant', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Primary Button" onPress={() => {}} variant="primary" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with secondary variant', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Secondary Button" onPress={() => {}} variant="secondary" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with outline variant', () => {
    const tree = ReactTestRenderer.create(
      <PTButton title="Outline Button" onPress={() => {}} variant="outline" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTButton title="Test Button" onPress={onPressMock} />
    );
    const instance = component.root;
    const button = instance.findByType('TouchableOpacity');
    button.props.onPress();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTButton title="Test Button" onPress={onPressMock} disabled={true} />
    );
    const instance = component.root;
    const button = instance.findByType('TouchableOpacity');
    expect(button.props.disabled).toBe(true);
  });
});

