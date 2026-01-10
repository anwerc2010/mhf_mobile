/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTTooltip from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      surface: '#FFFFFF',
    },
    spacing: {
      md: 16,
      sm: 8,
      xs: 4,
    },
    borderRadius: {
      md: 8,
    },
    shadows: {
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTTooltip', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(
      <PTTooltip content="Tooltip text">
        <React.Fragment>Hover me</React.Fragment>
      </PTTooltip>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with different positions', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const tree = ReactTestRenderer.create(
        <PTTooltip content="Tooltip text" position={position}>
          <React.Fragment>Hover me</React.Fragment>
        </PTTooltip>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders correctly when visible is controlled', () => {
    const tree = ReactTestRenderer.create(
      <PTTooltip content="Tooltip text" visible={true}>
        <React.Fragment>Hover me</React.Fragment>
      </PTTooltip>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onVisibleChange when toggled', () => {
    const onVisibleChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTTooltip content="Tooltip text" onVisibleChange={onVisibleChangeMock}>
        <React.Fragment>Hover me</React.Fragment>
      </PTTooltip>
    );
    const instance = component.root;
    const touchable = instance.findByType('TouchableOpacity');
    touchable.props.onPress();
    expect(onVisibleChangeMock).toHaveBeenCalledWith(true);
  });
});

