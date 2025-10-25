import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { App } from './App';

describe('Root route', () => {
  it('renders the Home and Health buttons', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>,
    );

    // Assert the buttons are rendered
    expect(screen.getByRole('link', { name: /home/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /health/i })).toBeDefined();
  });
});
