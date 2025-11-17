import { Box, Flex, Text } from '@chakra-ui/react';
import InternalLink from './InternalLink';
import { ROUTES } from '@/routes/routeTree';

export default function Footer() {
  return (
    <Box height="fit-content" as="footer" borderTopWidth="1px" bottom="0">
      <Flex
        height="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={1}
      >
        <Text>
          © {new Date().getFullYear()} TaskForge. All rights reserved.
        </Text>
        <InternalLink to={ROUTES.LEARN_MORE}>Learn More</InternalLink>
      </Flex>
    </Box>
  );
}
