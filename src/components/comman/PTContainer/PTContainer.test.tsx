/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTContainer from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      background: '#F5F5F5',
    },
  }),
}));

describe('PTContainer', () => {
  it('renders correctly with children', () => {
    const tree = ReactTestRenderer.create(
      <PTContainer>
        <React.Fragment>Container Content</React.Fragment>
      </PTContainer>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with safeArea', () => {
    const tree = ReactTestRenderer.create(
      <PTContainer safeArea>
        <React.Fragment>Container Content</React.Fragment>
      </PTContainer>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom style', () => {
    const tree = ReactTestRenderer.create(
      <PTContainer style={{ padding: 20 }}>
        <React.Fragment>Container Content</React.Fragment>
      </PTContainer>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

