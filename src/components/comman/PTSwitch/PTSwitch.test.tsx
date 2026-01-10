/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTSwitch from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      border: '#CCCCCC',
      primary: '#007AFF',
      textTertiary: '#999999',
    },
    spacing: {
      md: 16,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTSwitch', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(
      <PTSwitch value={false} onValueChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with label', () => {
    const tree = ReactTestRenderer.create(
      <PTSwitch value={false} onValueChange={() => {}} label="Enable notifications" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when value is true', () => {
    const tree = ReactTestRenderer.create(
      <PTSwitch value={true} onValueChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = ReactTestRenderer.create(
      <PTSwitch value={false} onValueChange={() => {}} disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onValueChange when toggled', () => {
    const onValueChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTSwitch value={false} onValueChange={onValueChangeMock} />
    );
    const instance = component.root;
    const switchComponent = instance.findByType('Switch');
    switchComponent.props.onValueChange(true);
    expect(onValueChangeMock).toHaveBeenCalledWith(true);
  });
});

