import {
  Box,
  Flex,
  Grid,
  Heading,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import {
  MdOutlineAssignment,
  MdOutlineHistory,
  MdOutlineWork,
} from 'react-icons/md';
import { useEffect, useState } from 'react';
import type {
  Activity,
  ActivityResponse,
  Project,
  ProjectsResponse,
  Task,
  TasksResponse,
} from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { GET } from '@/utilities/fetch';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import { subscribe, unsubscribe } from '@/utilities/events';
import OverviewCard from '@/components/OverviewCard';
import { EmptyState } from '@/components/EmptyState';

export enum OVERVIEW_CARD_LABELS {
  RECENT_PROJECTS = 'Recent Projects',
  RECENT_TASKS = 'Recent Tasks',
  RECENT_ACTIVITY = 'Recent Activity',
}

export default function Dashboard() {
  const [activeOverviewCard, setActiveOverviewCard] =
    useState<OVERVIEW_CARD_LABELS>(OVERVIEW_CARD_LABELS.RECENT_PROJECTS);

  const projectsQuery = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: async () => {
      return await GET<ProjectsResponse>(
        `/projects?ownerId=${import.meta.env.VITE_USER_ID}`,
      );
    },
  });

  const tasksQuery = useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: async () => {
      return await GET<TasksResponse>(
        `/tasks?userId=${import.meta.env.VITE_USER_ID}`,
      );
    },
  });

  const activityQuery = useQuery({
    queryKey: [QUERY_KEYS.ACTIVITY],
    queryFn: async () => {
      return await GET<ActivityResponse>(
        `/activity?userId=${import.meta.env.VITE_USER_ID}`,
      );
    },
  });

  const currentQuery =
    activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_PROJECTS
      ? projectsQuery
      : activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_TASKS
        ? tasksQuery
        : activityQuery;

  const { isLoading, isError, data, error } = currentQuery;

  useEffect(() => {
    subscribe('tf-overview-selected', (event: Event) => {
      const customEvent = event as CustomEvent<OVERVIEW_CARD_LABELS>;
      setActiveOverviewCard(customEvent.detail);
    });
    return () => {
      unsubscribe('tf-overview-selected', (event: Event) => {
        const customEvent = event as CustomEvent<OVERVIEW_CARD_LABELS>;
        setActiveOverviewCard(customEvent.detail);
      });
    };
  });

  return (
    <>
      <Flex direction="column" p={8} gap={8}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Dashboard</Heading>
          <CreateProjectDialog />
        </Flex>

        {/* Overview Cards */}
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={4}
        >
          <OverviewCard
            isActive={
              activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_PROJECTS
            }
            icon={MdOutlineWork}
            label={OVERVIEW_CARD_LABELS.RECENT_PROJECTS}
          />
          <OverviewCard
            isActive={activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_TASKS}
            icon={MdOutlineAssignment}
            label={OVERVIEW_CARD_LABELS.RECENT_TASKS}
          />
          <OverviewCard
            isActive={
              activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_ACTIVITY
            }
            icon={MdOutlineHistory}
            label={OVERVIEW_CARD_LABELS.RECENT_ACTIVITY}
          />
        </Grid>

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
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            {activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_PROJECTS && (
              <ProjectsTable data={data.data as Array<Project>} />
            )}
            {activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_TASKS && (
              <TasksTable data={data.data as Array<Task>} />
            )}
            {activeOverviewCard === OVERVIEW_CARD_LABELS.RECENT_ACTIVITY && (
              <ActivityTable data={data.data as Array<Activity>} />
            )}
          </Box>
        ) : (
          !isLoading && <EmptyState type={activeOverviewCard} />
        )}
      </Flex>
    </>
  );
}

/* Table Components */
function ProjectsTable({ data }: { data: Array<Project> }) {
  return (
    <Table.Root variant="outline" size="md">
      <Table.Header bg="gray.100" _dark={{ bg: 'gray.700' }}>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Updated</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((project) => (
          <Table.Row
            key={project.id}
            _hover={{
              bg: 'gray.50',
              _dark: { bg: 'gray.800' },
              cursor: 'pointer',
            }}
          >
            <Table.Cell fontWeight="medium">{project.name}</Table.Cell>
            <Table.Cell>{project.description ?? '-'}</Table.Cell>
            <Table.Cell>
              {new Date(project.updatedAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function TasksTable({ data }: { data: Array<Task> }) {
  return (
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
        {data.map((task) => (
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
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function ActivityTable({ data }: { data: Array<Activity> }) {
  return (
    <Table.Root variant="outline" size="md">
      <Table.Header bg="gray.100" _dark={{ bg: 'gray.700' }}>
        <Table.Row>
          <Table.ColumnHeader>Action</Table.ColumnHeader>
          <Table.ColumnHeader>Message</Table.ColumnHeader>
          <Table.ColumnHeader>Date</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((activity) => (
          <Table.Row
            key={activity.id}
            _hover={{
              bg: 'gray.50',
              _dark: { bg: 'gray.800' },
              cursor: 'pointer',
            }}
          >
            <Table.Cell fontWeight="medium">{activity.action}</Table.Cell>
            <Table.Cell>{activity.message ?? '-'}</Table.Cell>
            <Table.Cell>
              {new Date(activity.createdAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
