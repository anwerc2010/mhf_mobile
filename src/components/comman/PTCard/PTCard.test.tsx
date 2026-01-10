/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTCard from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
    },
    spacing: {
      cardPadding: 16,
    },
    borderRadius: {
      lg: 12,
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

describe('PTCard', () => {
  it('renders correctly with children', () => {
    const tree = ReactTestRenderer.create(
      <PTCard>
        <React.Fragment>Card Content</React.Fragment>
      </PTCard>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom style', () => {
    const tree = ReactTestRenderer.create(
      <PTCard style={{ marginTop: 10 }}>
        <React.Fragment>Card Content</React.Fragment>
      </PTCard>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

