import {
  Box,
  Drawer,
  Flex,
  Heading,
  IconButton,
  Portal,
  VStack,
} from '@chakra-ui/react';
import { CgCloseO, CgToolbarRight } from 'react-icons/cg';
import { useState } from 'react';
import { ROUTES } from '@/routes/routeTree';
import InternalLink from '@/components/InternalLink';

export default function Header() {
  const [open, isOpen] = useState(false);
  return (
    <Box height="fit-content" bg="blue.900" px={4} py={4} color="white">
      <Flex
        height="100%"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="md">
          <InternalLink
            href={ROUTES.HOME}
            fontWeight="bold"
            _hover={{ textDecorationColor: 'white' }}
          >
            TaskForge
          </InternalLink>
        </Heading>
        <Drawer.Root
          placement="end"
          open={open}
          onOpenChange={(e) => isOpen(e.open)}
        >
          <Drawer.Backdrop />
          <Drawer.Trigger asChild>
            <IconButton
              aria-label="Main menu"
              as={CgToolbarRight}
              size="2xs"
              variant="ghost"
            />
          </Drawer.Trigger>
          <Portal>
            <Drawer.Positioner padding="4">
              <Drawer.Content rounded="md">
                <Drawer.CloseTrigger>
                  <IconButton
                    aria-label="Close menu"
                    as={CgCloseO}
                    size="2xs"
                    variant="ghost"
                  />
                </Drawer.CloseTrigger>
                <Drawer.Header>
                  <Drawer.Title></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack>
                    <InternalLink
                      href={ROUTES.DASHBOARD}
                      fontWeight="bold"
                      _hover={{ textDecorationColor: 'white' }}
                      onClick={() => isOpen(false)}
                    >
                      Dashboard
                    </InternalLink>
                    <InternalLink
                      href={ROUTES.ACTIVITY_LOG}
                      fontWeight="bold"
                      _hover={{ textDecorationColor: 'white' }}
                      onClick={() => isOpen(false)}
                    >
                      Activity Log
                    </InternalLink>
                    <InternalLink
                      href={ROUTES.LEARN_MORE}
                      fontWeight="bold"
                      _hover={{ textDecorationColor: 'white' }}
                      onClick={() => isOpen(false)}
                    >
                      Learn More
                    </InternalLink>
                  </VStack>
                </Drawer.Body>
                <Drawer.Footer></Drawer.Footer>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
    </Box>
  );
}
