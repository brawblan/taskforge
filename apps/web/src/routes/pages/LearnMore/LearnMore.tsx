import {
  Box,
  Container,
  Flex,
  Heading,
  List,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SlideFade } from '@chakra-ui/transition';
import { ROUTES } from '@/routes/routeTree';
import InternalLink from '@/components/InternalLink';

export default function LearnMore() {
  return (
    <Flex direction="column" minH="100vh">
      <Container maxW="4xl" flex="1" py={20}>
        <SlideFade in offsetY="25%" transition={{ enter: { duration: 0.5 } }}>
          <VStack align="start">
            <Heading size="2xl">What is TaskForge?</Heading>

            <Text fontSize="lg">
              TaskForge is a modular, full-stack task management system built
              with modern web technologies. It’s designed to showcase best
              practices in software architecture, testing discipline, and
              iterative development.
            </Text>

            <Text fontSize="lg">
              The app lets users create, manage, and track projects and tasks
              while maintaining a clean, scalable backend and intuitive UI.
            </Text>
            <Text fontSize="lg">It’s built with:</Text>

            <List.Root fontSize="md" ml="8">
              <List.Item>
                <strong>NestJS + Prisma</strong> for a type-safe backend with
                modular architecture
              </List.Item>
              <List.Item>
                <strong>React + TanStack Router</strong> for a fast, modern
                frontend
              </List.Item>
              <List.Item>
                <strong>Chakra UI</strong> for accessible, responsive,
                theme-ready styling
              </List.Item>
              <List.Item>
                <strong>PostgreSQL</strong> as a reliable, developer-friendly
                database
              </List.Item>
            </List.Root>

            <Text fontSize="lg">
              As the project evolves, TaskForge will include advanced features
              such as activity tracking, authentication, and project analytics —
              making it a full demonstration of a scalable production-grade web
              app.
            </Text>

            <Box pt={4}>
              <InternalLink to={ROUTES.HOME} fontWeight="medium">
                ← Back to Home
              </InternalLink>
            </Box>
          </VStack>
        </SlideFade>
      </Container>
    </Flex>
  );
}
