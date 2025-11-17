import React from 'react';
import { Link } from '@chakra-ui/react';
import { createLink } from '@tanstack/react-router';
import type { LinkComponent } from '@tanstack/react-router';

interface ChakraLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> {
  // Add any additional props you want to pass to the link
}

const ChakraLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  ChakraLinkProps
>((props, ref) => {
  return <Link ref={ref} {...props} />;
});

const CustomLink = createLink(ChakraLinkComponent);

const InternalLink: LinkComponent<typeof ChakraLinkComponent> = (props) => {
  return (
    <CustomLink
      _hover={{ textDecoration: 'underline', textDecorationThickness: '2px' }}
      _focus={{ textDecoration: 'underline', textDecorationThickness: '2px' }}
      preload={'intent'}
      {...props}
    >
      {props.children}
    </CustomLink>
  );
};

export default InternalLink;
