import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Heading, Spinner, Table, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { OVERVIEW_CARD_LABELS } from '../Dashboard/Dashboard';
import type { ProjectsResponse } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { GET } from '@/utilities/fetch';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/ui/pagination';

export default function Projects() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, page],
    queryFn: async () => {
      return await GET<ProjectsResponse>(
        `/projects?ownerId=${import.meta.env.VITE_USER_ID}&page=${page}&limit=${pageSize}`,
      );
    },
  });

  return (
    <>
      <Flex direction="column" p={8} gap={8}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Projects</Heading>
          <CreateProjectDialog />
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
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                    <Table.ColumnHeader>Updated</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.data.map((project) => (
                    <Table.Row
                      key={project.id}
                      _hover={{
                        bg: 'gray.50',
                        _dark: { bg: 'gray.800' },
                      }}
                      css={{
                        '& td': {
                          padding: 0,
                        },
                      }}
                    >
                      <Table.Cell fontWeight="medium">
                        <Link
                          to="/project/$id"
                          params={{ id: project.id }}
                          style={{
                            display: 'block',
                            padding: 'var(--chakra-space-3) var(--chakra-space-4)',
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          {project.name}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to="/project/$id"
                          params={{ id: project.id }}
                          style={{
                            display: 'block',
                            padding: 'var(--chakra-space-3) var(--chakra-space-4)',
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          {project.description ?? '-'}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to="/project/$id"
                          params={{ id: project.id }}
                          style={{
                            display: 'block',
                            padding: 'var(--chakra-space-3) var(--chakra-space-4)',
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </Link>
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
