import { Box, Flex, Heading, Spinner, Table, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { OVERVIEW_CARD_LABELS } from '../Dashboard/Dashboard';
import type { TasksResponse } from '@/types/dashboard';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import { QUERY_KEYS } from '@/queries/KEYS';
import { GET } from '@/utilities/fetch';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/ui/pagination';

export default function Tasks() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QUERY_KEYS.TASKS, page],
    queryFn: async () => {
      return await GET<TasksResponse>(
        `/tasks?userId=${import.meta.env.VITE_USER_ID}&page=${page}&limit=${pageSize}`,
      );
    },
  });

  return (
    <>
      <Flex direction="column" p={8} gap={8}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Tasks</Heading>
          <CreateTaskDialog />
        </Flex>

        {/* Loading state */}
        {isLoading && (
          <Flex justify="center" align="center" minH="40vh">
            <Spinner size="xl" color="teal.400" />
          </Flex>
        )}

        {/* Error state */}
        {isError && (
          <Box textAlign="center" color="red.400">
            <Text>{error.message}</Text>
          </Box>
        )}

        {/* Data Table */}
        {data && data.data.length ? (
          <Flex direction="column" gap={4}>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Table.Root variant="outline" size="md">
                <Table.Header bg="gray.100" _dark={{ bg: 'gray.700' }}>
                  <Table.Row>
                    <Table.ColumnHeader>Title</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Priority</Table.ColumnHeader>
                    <Table.ColumnHeader>Due Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.data.map((task) => (
                    <Table.Row
                      key={task.id}
                      _hover={{
                        bg: 'gray.50',
                        _dark: { bg: 'gray.800' },
                        cursor: 'pointer',
                      }}
                    >
                      <Table.Cell fontWeight="medium">{task.title}</Table.Cell>
                      <Table.Cell>{task.status}</Table.Cell>
                      <Table.Cell>{task.priority}</Table.Cell>
                      <Table.Cell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : '-'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
            <Pagination
              currentPage={page}
              totalPages={data.meta.totalPages || 1}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </Flex>
        ) : (
          !isLoading && (
            <EmptyState type={OVERVIEW_CARD_LABELS.RECENT_PROJECTS} />
          )
        )}
      </Flex>
    </>
  );
}
