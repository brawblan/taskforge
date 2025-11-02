import { Icon, Link } from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { LinkProps } from '@chakra-ui/react';

export default function ExternalLink({ children, ...props }: LinkProps) {
  return (
    <Link display="inline-flex" alignItems="center" gap={1} {...props}>
      {children}
      <Icon>
        <FaExternalLinkAlt />
      </Icon>
    </Link>
  );
}
