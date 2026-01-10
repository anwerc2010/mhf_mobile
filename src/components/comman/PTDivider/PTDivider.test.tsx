/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTDivider from './index';

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      borderLight: '#E5E5E5',
    },
  }),
}));

describe('PTDivider', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(<PTDivider />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with horizontal orientation', () => {
    const tree = ReactTestRenderer.create(<PTDivider orientation="horizontal" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with vertical orientation', () => {
    const tree = ReactTestRenderer.create(<PTDivider orientation="vertical" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with spacing', () => {
    const tree = ReactTestRenderer.create(<PTDivider spacing={16} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom style', () => {
    const tree = ReactTestRenderer.create(
      <PTDivider style={{ backgroundColor: '#FF0000' }} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

