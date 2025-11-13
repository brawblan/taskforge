import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiFolderPlus } from 'react-icons/fi';
import { OVERVIEW_CARD_LABELS } from '@/routes/pages/Dashboard/Dashboard';

export function EmptyState({ type }: { type: OVERVIEW_CARD_LABELS }) {
  const config = {
    [OVERVIEW_CARD_LABELS.RECENT_PROJECTS]: {
      title: 'No projects yet',
      message: 'Create your first project to get started with TaskForge.',
    },
    [OVERVIEW_CARD_LABELS.RECENT_TASKS]: {
      title: 'No recent tasks',
      message: 'No tasks have been updated in the last 7 days.',
    },
    [OVERVIEW_CARD_LABELS.RECENT_ACTIVITY]: {
      title: 'No recent activity',
      message: 'No activity has been recorded in the last 7 days.',
    },
  };

  const { title, message } = config[type];

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      borderWidth="1px"
      borderRadius="2xl"
      py={16}
      shadow="sm"
    >
      <Icon as={FiFolderPlus} boxSize={10} color="teal.500" mb={4} />
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray.500" mb={6}>
        {message}
      </Text>
    </Flex>
  );
}
