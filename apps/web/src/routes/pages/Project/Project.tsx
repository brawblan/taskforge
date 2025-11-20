import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
  Box,
  Button,
  Field,
  FieldLabel,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Select,
  Spinner,
  Table,
  Text,
  Textarea,
  VStack,
  createListCollection,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft, FiX } from 'react-icons/fi';
import type { Comment, Project, Task, TasksResponse } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { DELETE, GET, PATCH, POST } from '@/utilities/fetch';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import { ROUTES } from '@/routes/routeTree';
import InternalLink from '@/components/InternalLink';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TaskPriority,
  TaskStatus,
} from '@/types/task';
import { EmptyState } from '@/components/EmptyState';
import EditProjectDialog from '@/components/EditProjectDialog';

const DeleteIcon = () => <span>🗑️</span>;

const statusCollection = createListCollection({
  items: [
    { label: 'All statuses', value: '' },
    ...Object.values(TaskStatus).map((status) => ({
      label: TASK_STATUS_LABELS[status],
      value: status,
    })),
  ],
});

const priorityCollection = createListCollection({
  items: [
    { label: 'All priorities', value: '' },
    ...Object.values(TaskPriority).map((priority) => ({
      label: TASK_PRIORITY_LABELS[priority],
      value: priority,
    })),
  ],
});

const sortCollection = createListCollection({
  items: [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ],
});

export default function ProjectPage() {
  const { id: projectId = '' } = useParams({ strict: false });
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState('');
  const [projectEditDialogOpen, setProjectEditDialogOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [dueDateFrom, setDueDateFrom] = useState<string>('');
  const [dueDateTo, setDueDateTo] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Inline editing states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, projectId],
    queryFn: async () => {
      const data = await GET<Project>(`/projects/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });

  const hasActiveFilters =
    statusFilter || priorityFilter || dueDateFrom || dueDateTo;

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.TASKS,
      projectId,
      statusFilter,
      priorityFilter,
      dueDateFrom,
      dueDateTo,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        projectId,
        page: '1',
        limit: hasActiveFilters ? '1000' : '100',
      });

      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (dueDateFrom) params.append('dueDateFrom', dueDateFrom);
      if (dueDateTo) params.append('dueDateTo', dueDateTo);

      return await GET<TasksResponse>(`/tasks?${params.toString()}`);
    },
    enabled: !!projectId,
  });

  // Sort tasks client-side
  const sortedTasks = tasksData?.data
    ? [...tasksData.data].sort((a, b) => {
        const dateA = new Date(a.dueDate || 0).getTime();
        const dateB = new Date(b.dueDate || 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      })
    : [];

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, projectId],
    queryFn: async () => {
      return await GET<Array<Comment>>(`/comments?projectId=${projectId}`);
    },
    enabled: !!projectId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<Task>;
    }) => {
      return await PATCH(`/tasks/${taskId}`, data);
    },
    onMutate: async ({ taskId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [
          QUERY_KEYS.TASKS,
          projectId,
          statusFilter,
          priorityFilter,
          dueDateFrom,
          dueDateTo,
        ],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([
        QUERY_KEYS.TASKS,
        projectId,
        statusFilter,
        priorityFilter,
        dueDateFrom,
        dueDateTo,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        [
          QUERY_KEYS.TASKS,
          projectId,
          statusFilter,
          priorityFilter,
          dueDateFrom,
          dueDateTo,
        ],
        (old: TasksResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((task) =>
              task.id === taskId ? { ...task, ...data } : task,
            ),
          };
        },
      );

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          [
            QUERY_KEYS.TASKS,
            projectId,
            statusFilter,
            priorityFilter,
            dueDateFrom,
            dueDateTo,
          ],
          context.previousTasks,
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TASKS, projectId],
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await POST('/comments', {
        content,
        userId: import.meta.env.VITE_USER_ID,
        projectId,
      });
    },
    onSuccess: () => {
      refetchComments();
      setNewComment('');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return await DELETE(`/comments/${commentId}`);
    },
    onSuccess: () => {
      refetchComments();
    },
  });

  const handleClearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setDueDateFrom('');
    setDueDateTo('');
    setSortOrder('newest');
  };

  const handleStartEdit = (
    taskId: string,
    field: string,
    currentValue: string,
  ) => {
    setEditingTaskId(taskId);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (taskId: string, field: string) => {
    updateTaskMutation.mutate({
      taskId,
      data: { [field]: editValue },
    });
    setEditingTaskId(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingField(null);
    setEditValue('');
  };

  if (projectLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="teal.400" />
      </Flex>
    );
  }

  if (!project) {
    return (
      <Box p={8}>
        <Text>Project not found</Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" p={8} gap={8}>
      {/* Back Button */}
      <Box>
        <InternalLink
          to={ROUTES.DASHBOARD}
          display="inline-flex"
          alignItems="center"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
          aria-label="Back to projects"
        >
          <FiChevronLeft />
        </InternalLink>
      </Box>

      {/* Title Section */}
      <HStack>
        <Heading size="lg">{project.name}</Heading>
      </HStack>

      {/* Description Section */}
      <Box>
        <Text color="gray.700" _dark={{ color: 'gray.300' }} flex={1}>
          {project.description || 'No description'}
        </Text>
      </Box>

      <Box>
        <Button size="sm" onClick={() => setProjectEditDialogOpen(true)}>
          Edit Project
        </Button>
      </Box>
      <EditProjectDialog
        project={project}
        open={projectEditDialogOpen}
        onOpenChange={setProjectEditDialogOpen}
      />

      {/* Tasks Table */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Tasks</Heading>
          <CreateTaskDialog projectId={projectId} />
        </Flex>

        {/* Filter Bar */}
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: 'gray.800' }}
        >
          <VStack align="stretch" gap={3}>
            <HStack gap={4} wrap="wrap">
              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Status
                </Text>
                <Select.Root
                  collection={statusCollection}
                  value={statusFilter ? [statusFilter] : []}
                  onValueChange={(e) => setStatusFilter(e.value[0] || '')}
                  size="sm"
                >
                  <Select.Label srOnly>Status Filter</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText
                        placeholder="All statuses"
                        color="gray.900"
                        _dark={{ color: 'gray.100' }}
                      />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {statusCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Box>

              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Priority
                </Text>
                <Select.Root
                  collection={priorityCollection}
                  value={priorityFilter ? [priorityFilter] : []}
                  onValueChange={(e) => setPriorityFilter(e.value[0] || '')}
                  size="sm"
                >
                  <Select.Label srOnly>Priority Filter</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText
                        placeholder="All priorities"
                        color="gray.900"
                        _dark={{ color: 'gray.100' }}
                      />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {priorityCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Box>

              <Field.Root flex="1" minW="150px">
                <FieldLabel
                  fontSize="sm"
                  fontWeight="medium"
                  mb={1}
                  as="label"
                  htmlFor="dueDateFrom"
                >
                  Due Date From
                </FieldLabel>
                <Input
                  id="dueDateFrom"
                  type="date"
                  size="sm"
                  value={dueDateFrom}
                  onChange={(e) => setDueDateFrom(e.target.value)}
                  aria-label="Due date from"
                />
              </Field.Root>

              <Field.Root flex="1" minW="150px">
                <FieldLabel
                  fontSize="sm"
                  fontWeight="medium"
                  mb={1}
                  as="label"
                  htmlFor="dueDateTo"
                >
                  Due Date To
                </FieldLabel>
                <Input
                  id="dueDateTo"
                  type="date"
                  size="sm"
                  value={dueDateTo}
                  onChange={(e) => setDueDateTo(e.target.value)}
                  aria-label="Due date to"
                />
              </Field.Root>

              <Box flex="1" minW="150px">
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Sort By
                </Text>
                <Select.Root
                  collection={sortCollection}
                  value={[sortOrder]}
                  onValueChange={(e) =>
                    setSortOrder(e.value[0] as 'newest' | 'oldest')
                  }
                  size="sm"
                >
                  <Select.Label srOnly>Sort Order</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText />
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {sortCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Box>
            </HStack>

            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
                alignSelf="flex-start"
              >
                <FiX /> Clear Filters
              </Button>
            )}
          </VStack>
        </Box>

        {tasksLoading ? (
          <Flex justify="center" p={8}>
            <Spinner />
          </Flex>
        ) : tasksData && tasksData.data.length > 0 ? (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Table.Root variant="outline" size="md">
              <Table.Header bg="gray.100" _dark={{ bg: 'gray.700' }}>
                <Table.Row>
                  <Table.ColumnHeader>Title</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Priority</Table.ColumnHeader>
                  <Table.ColumnHeader>Due Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedTasks.map((task) => (
                  <Table.Row
                    key={task.id}
                    _hover={{
                      bg: 'gray.50',
                      _dark: { bg: 'gray.800' },
                    }}
                  >
                    <Table.Cell fontWeight="medium">
                      <InternalLink
                        to={ROUTES.TASK_ID}
                        params={{ id: task.id }}
                      >
                        {task.title}
                      </InternalLink>
                    </Table.Cell>
                    <Table.Cell>
                      {editingTaskId === task.id &&
                      editingField === 'status' ? (
                        <Box p={2}>
                          <Select.Root
                            collection={statusCollection}
                            value={[editValue]}
                            onValueChange={(e) => {
                              setEditValue(e.value[0]);
                              updateTaskMutation.mutate({
                                taskId: task.id,
                                data: { status: e.value[0] },
                              });
                              handleCancelEdit();
                            }}
                            size="sm"
                            positioning={{ strategy: 'fixed' }}
                          >
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {statusCollection.items
                                  .filter((item) => item.value !== '')
                                  .map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                      <Select.ItemText>
                                        {item.label}
                                      </Select.ItemText>
                                    </Select.Item>
                                  ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        </Box>
                      ) : (
                        <Box
                          p={3}
                          cursor="pointer"
                          tabIndex={0}
                          onClick={() =>
                            handleStartEdit(task.id, 'status', task.status)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleStartEdit(task.id, 'status', task.status);
                            }
                          }}
                          title="Click or press Enter to edit"
                          role="button"
                          aria-label={`Edit status: ${TASK_STATUS_LABELS[task.status as TaskStatus] || task.status}`}
                        >
                          {TASK_STATUS_LABELS[task.status as TaskStatus] ||
                            task.status}
                        </Box>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingTaskId === task.id &&
                      editingField === 'priority' ? (
                        <Box p={2}>
                          <Select.Root
                            collection={priorityCollection}
                            value={[editValue]}
                            onValueChange={(e) => {
                              setEditValue(e.value[0]);
                              updateTaskMutation.mutate({
                                taskId: task.id,
                                data: { priority: e.value[0] },
                              });
                              handleCancelEdit();
                            }}
                            size="sm"
                            positioning={{ strategy: 'fixed' }}
                          >
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {priorityCollection.items
                                  .filter((item) => item.value !== '')
                                  .map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                      <Select.ItemText>
                                        {item.label}
                                      </Select.ItemText>
                                    </Select.Item>
                                  ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        </Box>
                      ) : (
                        <Box
                          p={3}
                          cursor="pointer"
                          tabIndex={0}
                          onClick={() =>
                            handleStartEdit(task.id, 'priority', task.priority)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleStartEdit(
                                task.id,
                                'priority',
                                task.priority,
                              );
                            }
                          }}
                          title="Click or press Enter to edit"
                          role="button"
                          aria-label={`Edit priority: ${TASK_PRIORITY_LABELS[task.priority as TaskPriority] || task.priority}`}
                        >
                          {TASK_PRIORITY_LABELS[
                            task.priority as TaskPriority
                          ] || task.priority}
                        </Box>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingTaskId === task.id &&
                      editingField === 'dueDate' ? (
                        <HStack p={2}>
                          <Input
                            type="date"
                            size="sm"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onBlur={() => handleSaveEdit(task.id, 'dueDate')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter')
                                handleSaveEdit(task.id, 'dueDate');
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                        </HStack>
                      ) : (
                        <Box
                          p={3}
                          cursor="pointer"
                          tabIndex={0}
                          onClick={() =>
                            handleStartEdit(
                              task.id,
                              'dueDate',
                              task.dueDate
                                ? new Date(task.dueDate)
                                    .toISOString()
                                    .split('T')[0]
                                : '',
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleStartEdit(
                                task.id,
                                'dueDate',
                                task.dueDate
                                  ? new Date(task.dueDate)
                                      .toISOString()
                                      .split('T')[0]
                                  : '',
                              );
                            }
                          }}
                          title="Click or press Enter to edit"
                          role="button"
                          aria-label={`Edit due date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}`}
                        >
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : '-'}
                        </Box>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton
                        aria-label="Edit task"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTask(task);
                          setEditDialogOpen(true);
                        }}
                      >
                        ✏️
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : (
          <EmptyState
            icon={hasActiveFilters ? FiX : undefined}
            title={
              hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'
            }
            message={
              hasActiveFilters
                ? 'Try adjusting your filter criteria to see more results.'
                : 'Create your first task to get started.'
            }
            action={
              hasActiveFilters ? (
                <Button onClick={handleClearFilters} size="sm">
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        )}
      </Box>

      {selectedTask && (
        <EditTaskDialog
          task={selectedTask}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      {/* Comments Section */}
      <Box>
        <Heading size="md" mb={4}>
          Comments
        </Heading>
        <VStack align="stretch" gap={4}>
          {/* Add Comment */}
          <Box>
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              mb={2}
            />
            <Button
              onClick={() => addCommentMutation.mutate(newComment)}
              colorScheme="teal"
              size="sm"
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </Box>

          {/* Comments List */}
          {comments.map((comment) => (
            <Box
              key={comment.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="gray.50"
              _dark={{ bg: 'gray.800' }}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="sm">
                  {comment.user?.name || 'Unknown User'}
                </Text>
                <HStack>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                  {comment.userId === import.meta.env.VITE_USER_ID && (
                    <IconButton
                      aria-label="Delete comment"
                      as={DeleteIcon}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => deleteCommentMutation.mutate(comment.id)}
                    />
                  )}
                </HStack>
              </HStack>
              <Text>{comment.content}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
