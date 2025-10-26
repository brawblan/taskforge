import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Page404 from './Page404';

describe('404 Page', () => {
  it('renders the 404 page elements', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Page404 />
      </ChakraProvider>,
    );

    // Check that main elements are rendered
    expect(screen.getByAltText('404 Not Found')).toBeDefined();
    expect(screen.getByText('Oops! This page doesn’t exist.')).toBeDefined();
    expect(screen.getByRole('link', { name: /go back home/i })).toBeDefined();
  });
});
