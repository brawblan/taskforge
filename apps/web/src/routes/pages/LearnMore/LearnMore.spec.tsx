import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import LearnMore from './LearnMore';

describe.skip('Learn More Page', () => {
  it('renders the Learn More page elements', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <LearnMore />
      </ChakraProvider>,
    );
  });
});
