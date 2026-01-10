/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTHeader from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      borderLight: '#E5E5E5',
      text: '#000000',
    },
    spacing: {
      md: 16,
      sm: 8,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTHeader', () => {
  it('renders correctly with title', () => {
    const tree = ReactTestRenderer.create(
      <PTHeader title="Header Title" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with left icon', () => {
    const tree = ReactTestRenderer.create(
      <PTHeader title="Header Title" leftIcon={<React.Fragment>←</React.Fragment>} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with right icon', () => {
    const tree = ReactTestRenderer.create(
      <PTHeader title="Header Title" rightIcon={<React.Fragment>→</React.Fragment>} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onLeftPress when left icon is pressed', () => {
    const onLeftPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTHeader
        title="Header Title"
        leftIcon={<React.Fragment>←</React.Fragment>}
        onLeftPress={onLeftPressMock}
      />
    );
    const instance = component.root;
    const touchable = instance.findAllByType('TouchableOpacity')[0];
    touchable.props.onPress();
    expect(onLeftPressMock).toHaveBeenCalledTimes(1);
  });

  it('calls onRightPress when right icon is pressed', () => {
    const onRightPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTHeader
        title="Header Title"
        rightIcon={<React.Fragment>→</React.Fragment>}
        onRightPress={onRightPressMock}
      />
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    touchables[touchables.length - 1].props.onPress();
    expect(onRightPressMock).toHaveBeenCalledTimes(1);
  });
});

