/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTTabs from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      text: '#000000',
      textInverse: '#FFFFFF',
      border: '#CCCCCC',
      borderLight: '#E5E5E5',
      error: '#FF3B30',
      backgroundSecondary: '#F5F5F5',
    },
    spacing: {
      md: 16,
      sm: 8,
      xs: 4,
    },
    borderRadius: {
      md: 8,
      full: 9999,
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

const mockTabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <React.Fragment>Tab 1 Content</React.Fragment>,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <React.Fragment>Tab 2 Content</React.Fragment>,
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <React.Fragment>Tab 3 Content</React.Fragment>,
  },
];

describe('PTTabs', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(<PTTabs tabs={mockTabs} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with pills variant', () => {
    const tree = ReactTestRenderer.create(
      <PTTabs tabs={mockTabs} variant="pills" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with badges', () => {
    const tabsWithBadges = [
      { ...mockTabs[0], badge: 5 },
      { ...mockTabs[1], badge: '99+' },
      mockTabs[2],
    ];
    const tree = ReactTestRenderer.create(<PTTabs tabs={tabsWithBadges} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with initial tab', () => {
    const tree = ReactTestRenderer.create(
      <PTTabs tabs={mockTabs} initialTabId="tab2" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with scrollable tabs', () => {
    const manyTabs = Array.from({ length: 10 }, (_, i) => ({
      id: `tab${i}`,
      label: `Tab ${i + 1}`,
      content: <React.Fragment>Content {i + 1}</React.Fragment>,
    }));
    const tree = ReactTestRenderer.create(
      <PTTabs tabs={manyTabs} scrollable={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onTabChange when tab is pressed', () => {
    const onTabChangeMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTTabs tabs={mockTabs} onTabChange={onTabChangeMock} />
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    touchables[1].props.onPress(); // Second tab
    expect(onTabChangeMock).toHaveBeenCalledWith('tab2');
  });
});

