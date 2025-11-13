import { Box, Flex, Heading, Spinner, Table, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { OVERVIEW_CARD_LABELS } from '../Dashboard/Dashboard';
import type { ActivityResponse } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { GET } from '@/utilities/fetch';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/ui/pagination';

export default function ActivityLog() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QUERY_KEYS.ACTIVITY, page],
    queryFn: async () => {
      return await GET<ActivityResponse>(
        `/activity?userId=${import.meta.env.VITE_USER_ID}&page=${page}&limit=${pageSize}`,
      );
    },
  });
  return (
    <>
      <Flex direction="column" p={8} gap={8}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Activity Log</Heading>
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
                    <Table.ColumnHeader>Action</Table.ColumnHeader>
                    <Table.ColumnHeader>Message</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.data.map((activity) => (
                    <Table.Row
                      key={activity.id}
                      _hover={{
                        bg: 'gray.50',
                        _dark: { bg: 'gray.800' },
                        cursor: 'pointer',
                      }}
                    >
                      <Table.Cell fontWeight="medium">
                        {activity.action}
                      </Table.Cell>
                      <Table.Cell>{activity.message ?? '-'}</Table.Cell>
                      <Table.Cell>
                        {new Date(activity.createdAt).toLocaleDateString()}
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
