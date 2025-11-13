import { Button, HStack, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <HStack justify="space-between" w="full">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious || isLoading}
      >
        <FiChevronLeft />
        Previous
      </Button>

      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        Page {currentPage} of {totalPages}
      </Text>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
      >
        Next
        <FiChevronRight />
      </Button>
    </HStack>
  );
}
