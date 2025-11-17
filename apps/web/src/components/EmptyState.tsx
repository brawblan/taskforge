import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiFolderPlus } from 'react-icons/fi';

export function EmptyState() {
  const title = 'Title';
  const message = 'Message';

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
