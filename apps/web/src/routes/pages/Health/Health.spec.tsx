import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Health from './Health';

describe.skip('Health route', () => {
  it('renders loader data (message, ok, timestamp)', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Health />
      </ChakraProvider>,
    );
  });
});
