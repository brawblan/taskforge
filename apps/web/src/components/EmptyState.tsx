import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiFolderPlus } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface EmptyStateProps {
  icon?: IconType;
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const finalIcon = icon || FiFolderPlus;
  const finalTitle = title || 'No items';
  const finalMessage = message || '';

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
      <Icon as={finalIcon} boxSize={10} color="teal.500" mb={4} />
      <Heading size="md" mb={2}>
        {finalTitle}
      </Heading>
      <Text color="gray.500" mb={action ? 6 : 0}>
        {finalMessage}
      </Text>
      {action}
    </Flex>
  );
}
