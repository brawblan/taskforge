import { Link } from '@chakra-ui/react';
import { Link as TanstackLink } from '@tanstack/react-router';
import type { LinkProps } from '@chakra-ui/react';

export default function InernalLink({ children, ...props }: LinkProps) {
  return (
    <Link
      as={TanstackLink}
      display="inline-flex"
      alignItems="center"
      gap={1}
      {...props}
    >
      {children}
    </Link>
  );
}
