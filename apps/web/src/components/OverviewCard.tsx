import { Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import type { OVERVIEW_CARD_LABELS } from '@/routes/pages/Dashboard/Dashboard';
import { publish } from '@/utilities/events';
import { Tooltip } from '@/components/ui/tooltip';

export default function OverviewCard({
  isActive,
  icon,
  label,
}: {
  isActive: boolean;
  icon: IconType;
  label: OVERVIEW_CARD_LABELS;
}) {
  const buttonRef = useRef(null);
  const selectOverview = () => {
    publish<OVERVIEW_CARD_LABELS>('tf-overview-selected', label);
  };
  return (
    <Button
      ref={buttonRef}
      variant="outline"
      p={10}
      borderWidth="1px"
      borderRadius="2xl"
      bg={isActive ? 'gray.800' : ''}
      onClick={selectOverview}
    >
      <Flex align="center" gap={4}>
        <Icon as={icon} boxSize={6} color="blue.500" />
        <HStack>
          <Text fontSize="sm" color={isActive ? 'gray.100' : 'gray.300'}>
            {label}
          </Text>
          <Tooltip content="Within the last 7 days.">
            <Icon as={FaInfoCircle} boxSize={4} />
          </Tooltip>
        </HStack>
      </Flex>
    </Button>
  );
}
