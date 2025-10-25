import { HStack, Link } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute()({ component: App });

export function App() {
  return (
    <HStack gap="24px" padding="24px">
      <Link href="/" _hover={{ textDecoration: 'none' }}>
        Home
      </Link>
      <Link href="/health" _hover={{ textDecoration: 'none' }}>
        Health
      </Link>
    </HStack>
  );
}
