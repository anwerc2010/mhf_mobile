/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PTText from './index';

// Mock the useTheme hook
jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textSecondary: '#666666',
      textTertiary: '#999999',
      primary: '#007AFF',
      error: '#FF3B30',
      success: '#34C759',
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
  }),
}));

describe('PTText', () => {
  it('renders correctly with default props', () => {
    const tree = ReactTestRenderer.create(<PTText>Test Text</PTText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with h1 variant', () => {
    const tree = ReactTestRenderer.create(
      <PTText variant="h1">Heading 1</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with h2 variant', () => {
    const tree = ReactTestRenderer.create(
      <PTText variant="h2">Heading 2</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with h3 variant', () => {
    const tree = ReactTestRenderer.create(
      <PTText variant="h3">Heading 3</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with body variant', () => {
    const tree = ReactTestRenderer.create(
      <PTText variant="body">Body Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with caption variant', () => {
    const tree = ReactTestRenderer.create(
      <PTText variant="caption">Caption Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with primary color', () => {
    const tree = ReactTestRenderer.create(
      <PTText color="primary">Primary Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error color', () => {
    const tree = ReactTestRenderer.create(
      <PTText color="error">Error Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with bold prop', () => {
    const tree = ReactTestRenderer.create(
      <PTText bold>Bold Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom style', () => {
    const tree = ReactTestRenderer.create(
      <PTText style={{ marginTop: 10 }}>Styled Text</PTText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

