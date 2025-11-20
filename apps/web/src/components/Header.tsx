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
    <Box height="fit-content" bg="blue.900" px={4} py={2} color="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md">
          <InternalLink to={ROUTES.HOME}>TaskForge</InternalLink>
        </Heading>
        <Drawer.Root
          placement="end"
          open={open}
          onOpenChange={(e) => isOpen(e.open)}
        >
          <Drawer.Backdrop />
          <Drawer.Trigger asChild>
            <IconButton aria-label="Main menu" size="xs" variant="ghost">
              <CgToolbarRight />
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Positioner padding="4">
              <Drawer.Content rounded="md">
                <Drawer.CloseTrigger>
                  <IconButton
                    aria-label="Close menu"
                    size="2xs"
                    variant="ghost"
                  >
                    <CgCloseO />
                  </IconButton>
                </Drawer.CloseTrigger>
                <Drawer.Header>
                  <Drawer.Title></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack>
                    <InternalLink
                      to={ROUTES.DASHBOARD}
                      onClick={() => isOpen(false)}
                    >
                      Dashboard
                    </InternalLink>
                    <InternalLink
                      to={ROUTES.ACTIVITY_LOG}
                      onClick={() => isOpen(false)}
                    >
                      Activity Log
                    </InternalLink>
                    <InternalLink
                      to={ROUTES.LEARN_MORE}
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
