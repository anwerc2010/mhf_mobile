/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTAccordion from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textSecondary: '#666666',
      surface: '#FFFFFF',
      backgroundSecondary: '#F5F5F5',
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

jest.mock('../PTDivider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />);
});

const mockItems = [
  {
    id: 'item1',
    title: 'Item 1',
    content: <React.Fragment>Content 1</React.Fragment>,
  },
  {
    id: 'item2',
    title: 'Item 2',
    content: <React.Fragment>Content 2</React.Fragment>,
  },
  {
    id: 'item3',
    title: 'Item 3',
    content: <React.Fragment>Content 3</React.Fragment>,
  },
];

describe('PTAccordion', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(<PTAccordion items={mockItems} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with default expanded item', () => {
    const itemsWithExpanded = [
      { ...mockItems[0], defaultExpanded: true },
      ...mockItems.slice(1),
    ];
    const tree = ReactTestRenderer.create(
      <PTAccordion items={itemsWithExpanded} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with allowMultiple', () => {
    const tree = ReactTestRenderer.create(
      <PTAccordion items={mockItems} allowMultiple={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with disabled item', () => {
    const itemsWithDisabled = [
      { ...mockItems[0], disabled: true },
      ...mockItems.slice(1),
    ];
    const tree = ReactTestRenderer.create(
      <PTAccordion items={itemsWithDisabled} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onItemToggle when item is toggled', () => {
    const onItemToggleMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTAccordion items={mockItems} onItemToggle={onItemToggleMock} />
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    touchables[0].props.onPress();
    expect(onItemToggleMock).toHaveBeenCalledWith('item1', true);
  });
});

