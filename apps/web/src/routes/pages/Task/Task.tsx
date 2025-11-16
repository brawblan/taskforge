import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import type { Comment, Task } from '@/types/dashboard';
import { QUERY_KEYS } from '@/queries/KEYS';
import { DELETE, GET, PATCH, POST } from '@/utilities/fetch';
import { ROUTES } from '@/routes/routeTree';

const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;

export default function TaskPage() {
  const { id: taskId } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: [QUERY_KEYS.TASKS, taskId],
    queryFn: async () => {
      const data = await GET<Task>(`/tasks/${taskId}`);
      setTitle(data.title);
      setDescription(data.description || '');
      return data;
    },
    enabled: !!taskId,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['comments', 'task', taskId],
    queryFn: async () => {
      return await GET<Array<Comment>>(`/comments?taskId=${taskId}`);
    },
    enabled: !!taskId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      return await PATCH(`/tasks/${taskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, taskId] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await POST('/comments', {
        content,
        userId: import.meta.env.VITE_USER_ID,
        taskId,
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
    updateTaskMutation.mutate({ title });
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    updateTaskMutation.mutate({ description });
    setIsEditingDescription(false);
  };

  if (taskLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="teal.400" />
      </Flex>
    );
  }

  if (!task) {
    return (
      <Box p={8}>
        <Text>Task not found</Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" p={8} gap={8}>
      {/* Back Button */}
      <Box>
        <IconButton
          aria-label="Back to project"
          as={FiChevronLeft}
          size="sm"
          variant="ghost"
          onClick={() =>
            navigate({ to: `${ROUTES.PROJECT}/${task.projectId}` })
          }
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
            <Heading size="lg">{task.title}</Heading>
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
              {task.description || 'No description'}
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

      {/* Task Details */}
      <Box p={4} borderWidth="1px" borderRadius="md">
        <VStack align="stretch" gap={2}>
          <HStack>
            <Text fontWeight="bold">Status:</Text>
            <Text>{task.status}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Priority:</Text>
            <Text>{task.priority}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Due Date:</Text>
            <Text>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : 'Not set'}
            </Text>
          </HStack>
        </VStack>
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
