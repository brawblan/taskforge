import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Health } from './Health';

vi.mock('../router', () => ({
  healthRoute: {
    useLoaderData: () => ({
      message: 'stubbed message',
      ok: true,
      timestamp: new Date('2025-10-25T12:00:00Z').toISOString(),
    }),
  },
}));

describe('Health route', () => {
  it('renders loader data (message, ok, timestamp)', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Health />
      </ChakraProvider>,
    );

    // Check the stubbed loader fields are rendered
    expect(screen.getByText(/Message:/i)).toBeDefined();
    expect(screen.getByText(/stubbed message/)).toBeDefined();
    expect(screen.getByText(/ok:/i)).toBeDefined();
    expect(screen.getByText(/true/)).toBeDefined();
    expect(screen.getByText(/Timestamp:/i)).toBeDefined();
  });
});
