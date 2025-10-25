import { Box, Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from '@tanstack/react-router';

const Header: React.FC = () => {
  return (
    <Box bg="teal.500" px={4} py={2} color="white">
      <Flex alignItems="center">
        <Heading size="md">
          <Link
            as={RouterLink}
            href="/"
            _hover={{ textDecoration: 'none', color: 'teal.200' }}
          >
            TaskForge
          </Link>
        </Heading>
        <Spacer />
        <Link
          as={RouterLink}
          href="/health"
          _hover={{ textDecoration: 'none', color: 'teal.200' }}
        >
          Health
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;
