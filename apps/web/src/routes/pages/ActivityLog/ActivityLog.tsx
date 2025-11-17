import {
  Box,
  Button,
  Code,
  Dialog,
  Flex,
  Heading,
  Spinner,
  Table,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { Activity, ActivityResponse } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { GET } from '@/utilities/fetch';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/ui/pagination';
import { ROUTES } from '@/routes/routeTree';
import InternalLink from '@/components/InternalLink';

export default function ActivityLog() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

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
                      onClick={() => setSelectedActivity(activity)}
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
          !isLoading && <EmptyState />
        )}
      </Flex>

      {/* Activity Detail Dialog */}
      <Dialog.Root
        open={selectedActivity !== null}
        onOpenChange={(e) => !e.open && setSelectedActivity(null)}
        size="lg"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Activity Details</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              {selectedActivity && (
                <Flex direction="column" gap={4}>
                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Action:
                    </Text>
                    <Text>{selectedActivity.action}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Message:
                    </Text>
                    <Text>{selectedActivity.message ?? '-'}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Date:
                    </Text>
                    <Text>
                      {new Date(selectedActivity.createdAt).toLocaleString()}
                    </Text>
                  </Box>

                  {(selectedActivity.oldValue !== null ||
                    selectedActivity.newValue !== null) && (
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Changes:
                      </Text>
                      <Tabs.Root defaultValue="friendly">
                        <Tabs.List>
                          <Tabs.Trigger value="friendly">
                            User Friendly
                          </Tabs.Trigger>
                          <Tabs.Trigger value="json">JSON</Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="friendly" p={4}>
                          <Flex direction="column" gap={3}>
                            {selectedActivity.oldValue !== null && (
                              <Box>
                                <Text fontWeight="semibold" color="red.500">
                                  Old Value:
                                </Text>
                                <Box
                                  p={2}
                                  bg="gray.50"
                                  _dark={{ bg: 'gray.700' }}
                                  borderRadius="md"
                                  mt={1}
                                >
                                  <Text>
                                    {formatValue(selectedActivity.oldValue)}
                                  </Text>
                                </Box>
                              </Box>
                            )}
                            {selectedActivity.newValue !== null && (
                              <Box>
                                <Text fontWeight="semibold" color="green.500">
                                  New Value:
                                </Text>
                                <Box
                                  p={2}
                                  bg="gray.50"
                                  _dark={{ bg: 'gray.700' }}
                                  borderRadius="md"
                                  mt={1}
                                >
                                  <Text>
                                    {formatValue(selectedActivity.newValue)}
                                  </Text>
                                </Box>
                              </Box>
                            )}
                          </Flex>
                        </Tabs.Content>

                        <Tabs.Content value="json" p={4}>
                          <Flex direction="column" gap={3}>
                            {selectedActivity.oldValue !== null && (
                              <Box>
                                <Text
                                  fontWeight="semibold"
                                  color="red.500"
                                  mb={1}
                                >
                                  Old Value:
                                </Text>
                                <Code
                                  display="block"
                                  p={2}
                                  borderRadius="md"
                                  whiteSpace="pre-wrap"
                                >
                                  {JSON.stringify(
                                    selectedActivity.oldValue,
                                    null,
                                    2,
                                  )}
                                </Code>
                              </Box>
                            )}
                            {selectedActivity.newValue !== null && (
                              <Box>
                                <Text
                                  fontWeight="semibold"
                                  color="green.500"
                                  mb={1}
                                >
                                  New Value:
                                </Text>
                                <Code
                                  display="block"
                                  p={2}
                                  borderRadius="md"
                                  whiteSpace="pre-wrap"
                                >
                                  {JSON.stringify(
                                    selectedActivity.newValue,
                                    null,
                                    2,
                                  )}
                                </Code>
                              </Box>
                            )}
                          </Flex>
                        </Tabs.Content>
                      </Tabs.Root>
                    </Box>
                  )}

                  <Flex gap={2} mt={2}>
                    {selectedActivity.projectId && (
                      <Button size="sm" colorPalette="blue" asChild>
                        <InternalLink
                          to={ROUTES.PROJECT_ID}
                          params={{ id: selectedActivity.projectId }}
                        >
                          View Project
                        </InternalLink>
                      </Button>
                    )}
                    {selectedActivity.taskId && (
                      <Button size="sm" colorPalette="teal" asChild>
                        <InternalLink
                          to={ROUTES.TASK_ID}
                          params={{ id: selectedActivity.taskId }}
                        >
                          View Task
                        </InternalLink>
                      </Button>
                    )}
                  </Flex>
                </Flex>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
  }
  return String(value);
}
