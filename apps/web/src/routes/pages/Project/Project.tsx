import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Link as TanstackLink,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Spinner,
  Table,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import type { Comment, Project, TasksResponse } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { DELETE, GET, PATCH, POST } from '@/utilities/fetch';

const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;

export default function ProjectPage() {
  const { id: projectId } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, projectId],
    queryFn: async () => {
      const data = await GET<Project>(`/projects/${projectId}`);
      setTitle(data.name);
      setDescription(data.description || '');
      return data;
    },
    enabled: !!projectId,
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: [QUERY_KEYS.TASKS, projectId],
    queryFn: async () => {
      return await GET<TasksResponse>(
        `/tasks?projectId=${projectId}&page=1&limit=100`,
      );
    },
    enabled: !!projectId,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['comments', projectId],
    queryFn: async () => {
      return await GET<Array<Comment>>(`/comments?projectId=${projectId}`);
    },
    enabled: !!projectId,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      return await PATCH(`/projects/${projectId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS, projectId],
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

  const handleSaveTitle = () => {
    updateProjectMutation.mutate({ name: title });
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    updateProjectMutation.mutate({ description });
    setIsEditingDescription(false);
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
        <IconButton
          aria-label="Back to projects"
          as={FiChevronLeft}
          size="sm"
          variant="ghost"
          onClick={() => navigate({ to: '/projects' })}
        />
      </Box>

      {/* Title Section */}
      <HStack>
        {isEditingTitle ? (
          <>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="lg"
              autoFocus
            />
            <Button onClick={handleSaveTitle} colorScheme="teal">
              Save
            </Button>
            <Button onClick={() => setIsEditingTitle(false)} variant="ghost">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Heading size="lg">{project.name}</Heading>
            <IconButton
              aria-label="Edit title"
              as={EditIcon}
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingTitle(true)}
            />
          </>
        )}
      </HStack>

      {/* Description Section */}
      <Box>
        {isEditingDescription ? (
          <VStack align="stretch" gap={2}>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              autoFocus
            />
            <HStack>
              <Button
                onClick={handleSaveDescription}
                colorScheme="teal"
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditingDescription(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <HStack align="start">
            <Text color="gray.600" flex={1}>
              {project.description || 'No description'}
            </Text>
            <IconButton
              aria-label="Edit description"
              as={EditIcon}
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingDescription(true)}
            />
          </HStack>
        )}
      </Box>

      {/* Tasks Table */}
      <Box>
        <Heading size="md" mb={4}>
          Tasks
        </Heading>
        {tasksLoading ? (
          <Spinner />
        ) : tasksData && tasksData.data.length > 0 ? (
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
                {tasksData.data.map((task) => (
                  <Table.Row
                    key={task.id}
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
                      <TanstackLink to="/task/$id" params={{ id: task.id }}>
                        {task.title}
                      </TanstackLink>
                    </Table.Cell>
                    <Table.Cell>
                      <TanstackLink to="/task/$id" params={{ id: task.id }}>
                        {task.status}
                      </TanstackLink>
                    </Table.Cell>
                    <Table.Cell>
                      <TanstackLink to="/task/$id" params={{ id: task.id }}>
                        {task.priority}
                      </TanstackLink>
                    </Table.Cell>
                    <Table.Cell>
                      <TanstackLink to="/task/$id" params={{ id: task.id }}>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : '-'}
                      </TanstackLink>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : (
          <Text color="gray.500">No tasks yet</Text>
        )}
      </Box>

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
