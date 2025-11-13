import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import ActivityLog from './ActivityLog';

describe.skip('404 Page', () => {
  it('renders the 404 page elements', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <ActivityLog />
      </ChakraProvider>,
    );
  });
});
