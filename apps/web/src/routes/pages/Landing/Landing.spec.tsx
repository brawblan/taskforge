import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Landing from './Landing';

describe.skip('Root route', () => {
  it('renders the Home and Health buttons', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Landing />
      </ChakraProvider>,
    );
  });
});
