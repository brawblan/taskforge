import { Box, Image, Link, Text } from '@chakra-ui/react';

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
      <Link
        href="/"
        color="teal.500"
        _hover={{ color: 'teal.600', textDecoration: 'underline' }}
        mt={2}
        fontSize="lg"
      >
        Go back home
      </Link>
    </Box>
  );
}
