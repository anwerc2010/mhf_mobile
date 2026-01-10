/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTEmptyState from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textSecondary: '#666666',
      primary: '#007AFF',
    },
    spacing: {
      lg: 24,
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

jest.mock('../PTButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <TouchableOpacity ref={ref} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  ));
});

describe('PTEmptyState', () => {
  it('renders correctly with title', () => {
    const tree = ReactTestRenderer.create(<PTEmptyState title="No items found" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title and message', () => {
    const tree = ReactTestRenderer.create(
      <PTEmptyState title="No items found" message="Try adding some items" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with icon', () => {
    const tree = ReactTestRenderer.create(
      <PTEmptyState title="No items found" icon={<React.Fragment>📭</React.Fragment>} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with action', () => {
    const tree = ReactTestRenderer.create(
      <PTEmptyState
        title="No items found"
        actionLabel="Add Item"
        onAction={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onAction when action button is pressed', () => {
    const onActionMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTEmptyState
        title="No items found"
        actionLabel="Add Item"
        onAction={onActionMock}
      />
    );
    const instance = component.root;
    const button = instance.findByType('TouchableOpacity');
    button.props.onPress();
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });
});

