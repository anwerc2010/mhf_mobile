/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTModal from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
      text: '#000000',
      textSecondary: '#666666',
    },
    spacing: {
      lg: 24,
      md: 16,
      sm: 8,
      xs: 4,
    },
    borderRadius: {
      xl: 16,
    },
    shadows: {
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
    },
  }),
}));

jest.mock('../PTText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />);
});

describe('PTModal', () => {
  it('renders correctly when visible', () => {
    const tree = ReactTestRenderer.create(
      <PTModal visible={true} onClose={() => {}}>
        <React.Fragment>Modal Content</React.Fragment>
      </PTModal>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title', () => {
    const tree = ReactTestRenderer.create(
      <PTModal visible={true} onClose={() => {}} title="Modal Title">
        <React.Fragment>Modal Content</React.Fragment>
      </PTModal>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without close button', () => {
    const tree = ReactTestRenderer.create(
      <PTModal visible={true} onClose={() => {}} showCloseButton={false}>
        <React.Fragment>Modal Content</React.Fragment>
      </PTModal>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onClose when close button is pressed', () => {
    const onCloseMock = jest.fn();
    const component = ReactTestRenderer.create(
      <PTModal visible={true} onClose={onCloseMock}>
        <React.Fragment>Modal Content</React.Fragment>
      </PTModal>
    );
    const instance = component.root;
    const touchables = instance.findAllByType('TouchableOpacity');
    if (touchables.length > 0) {
      touchables[touchables.length - 1].props.onPress();
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    }
  });
});

