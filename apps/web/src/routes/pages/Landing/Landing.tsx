import { Container, Flex, Heading, Text } from '@chakra-ui/react';
import { SlideFade } from '@chakra-ui/transition';
import { FaGithub } from 'react-icons/fa';
import ExternalLink from '@/components/ExternalLink';

export default function Landing() {
  return (
    <Flex direction="column" height="100%">
      {/* Hero Section */}
      <Container
        maxW="6xl"
        minH="80vh"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <SlideFade in offsetY="25%" transition={{ enter: { duration: 0.5 } }}>
          <Heading textAlign="center" size="2xl" mb={4}>
            TaskForge
          </Heading>

          <Text fontSize="xl" mb={8} textAlign="center">
            A modular, full-stack task management system for teams and
            developers.
          </Text>

          <Flex justify="center" gap={6}>
            <ExternalLink
              href="https://github.com/brawblan/taskforge"
              target="_blank"
              fontWeight="medium"
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              <FaGithub size={18} /> View on GitHub{' '}
            </ExternalLink>
          </Flex>
        </SlideFade>
      </Container>
    </Flex>
  );
}
