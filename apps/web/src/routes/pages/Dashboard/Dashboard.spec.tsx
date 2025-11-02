import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Dashboard from './Dashboard';

describe.skip('Dashboard', () => {
  it('renders the Dashboard elements', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Dashboard />
      </ChakraProvider>,
    );
  });
});
