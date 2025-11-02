import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import { ROUTES } from '@/routes/routeTree';
import InternalLink from '@/components/InternalLink';

export default function Header() {
  return (
    <Box height="10vh" bg="blue.900" px={4} py={2} color="white">
      <Flex height="100%" alignItems="center">
        <Heading size="md">
          <InternalLink
            href={ROUTES.HOME}
            fontWeight="bold"
            _hover={{ textDecorationColor: 'white' }}
          >
            TaskForge
          </InternalLink>
        </Heading>
        <Spacer />
        <InternalLink
          href={ROUTES.DASHBOARD}
          fontWeight="bold"
          _hover={{ textDecorationColor: 'white' }}
        >
          Sign In/Sign Up
        </InternalLink>
      </Flex>
    </Box>
  );
}
