import { Box, Image, Text } from '@chakra-ui/react';
import InternalLink from '@/components/InternalLink';
import { ROUTES } from '@/routes/routeTree';

export default function Page404() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Image src="logo192.png" alt="404 Not Found" />
      <Text fontSize="3xl" mt={4}>
        Oops! This page doesn’t exist.
      </Text>
      <InternalLink
        to={ROUTES.HOME}
        color="blue.500"
        _hover={{ color: 'blue.600', textDecoration: 'underline' }}
        mt={2}
        fontSize="lg"
      >
        Go back home
      </InternalLink>
    </Box>
  );
}
