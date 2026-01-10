/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTListItem from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#007AFF',
    },
    spacing: {
      md: 16,
      lg: 24,
      sm: 8,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

jest.mock('../PTAvatar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />);
});

jest.mock('../PTBadge', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />);
});

describe('PTListItem', () => {
  it('renders correctly with title', () => {
    const tree = ReactTestRenderer.create(<PTListItem title="List Item" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title and subtitle', () => {
    const tree = ReactTestRenderer.create(
      <PTListItem title="List Item" subtitle="Subtitle text" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with left icon', () => {
    const tree = ReactTestRenderer.create(
      <PTListItem title="List Item" leftIcon={<React.Fragment>←</React.Fragment>} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with right icon', () => {
    const tree = ReactTestRenderer.create(
      <PTListItem title="List Item" rightIcon={<React.Fragment>→</React.Fragment>} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with avatar', () => {
    const tree = ReactTestRenderer.create(
      <PTListItem title="List Item" avatar={{ name: 'John Doe' }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with badge', () => {
    const tree = ReactTestRenderer.create(
      <PTListItem title="List Item" badge={5} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTListItem title="List Item" onPress={onPressMock} />
    );
    const instance = component.root;
    const touchable = instance.findByType('TouchableOpacity');
    touchable.props.onPress();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

