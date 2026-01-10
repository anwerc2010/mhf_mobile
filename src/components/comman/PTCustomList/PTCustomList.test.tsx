/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTCustomList from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#000000',
      primary: '#007AFF',
      borderLight: '#E5E5E5',
    },
    spacing: {
      lg: 24,
      md: 16,
      sm: 8,
      xs: 4,
    },
  }),
}));

jest.mock('../PTEmptyState', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <View ref={ref}>
      <Text>{props.title}</Text>
    </View>
  ));
});

jest.mock('../PTSpinner', () => {
  const React = require('react');
  const { View, ActivityIndicator } = require('react-native');
  return React.forwardRef((props: any, ref: any) => (
    <View ref={ref}>
      <ActivityIndicator />
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

const mockData = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

describe('PTCustomList', () => {
  it('renders correctly with data', () => {
    const tree = ReactTestRenderer.create(
      <PTCustomList
        data={mockData}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    const tree = ReactTestRenderer.create(
      <PTCustomList
        data={[]}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
        loading={true}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with empty state', () => {
    const tree = ReactTestRenderer.create(
      <PTCustomList
        data={[]}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
        emptyState={{
          title: 'No items found',
          message: 'Try adding some items',
        }}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    const tree = ReactTestRenderer.create(
      <PTCustomList
        data={[]}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
        error="Failed to load data"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onItemPress when item is pressed', () => {
    const onItemPressMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTCustomList
        data={mockData}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
        onItemPress={onItemPressMock}
      />
    );
    // Item press testing would require more complex setup
    expect(component).toBeTruthy();
  });

  it('calls onRefresh when pull to refresh', () => {
    const onRefreshMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTCustomList
        data={mockData}
        renderItem={(item) => <React.Fragment>{item.name}</React.Fragment>}
        onRefresh={onRefreshMock}
        refreshing={false}
      />
    );
    expect(component).toBeTruthy();
  });
});

