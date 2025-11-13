import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Select,
  Textarea,
  VStack,
  createListCollection,
} from '@chakra-ui/react';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { FiPlus } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { ProjectsResponse } from '@/types/dashboard';
import { toaster } from '@/components/ui/toaster';
import { GET, POST } from '@/utilities/fetch';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TaskPriority,
  TaskStatus,
} from '@/types/task';

const taskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters long'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
});

const statusCollection = createListCollection({
  items: Object.values(TaskStatus).map((status) => ({
    label: TASK_STATUS_LABELS[status],
    value: status,
  })),
});

const priorityCollection = createListCollection({
  items: Object.values(TaskPriority).map((priority) => ({
    label: TASK_PRIORITY_LABELS[priority],
    value: priority,
  })),
});

export default function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = { data: [] } } = useQuery<ProjectsResponse>({
    queryKey: ['projects'],
    queryFn: () =>
      GET<ProjectsResponse>(
        `/projects?ownerId=${import.meta.env.VITE_USER_ID}`,
      ),
  });

  const projectCollection = useMemo(
    () =>
      createListCollection({
        items: projects.data.map((project: { name: any; id: any }) => ({
          label: project.name,
          value: project.id,
        })),
      }),
    [projects],
  );

  const taskMutation = useMutation({
    mutationFn: (value: {
      title: string;
      description?: string;
      status: string;
      priority: string;
      projectId?: string;
      dueDate?: string;
    }) => POST('/tasks', value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      form.reset();
      toaster.success({
        title: 'Task created',
        description: `"${data.title}" was successfully added.`,
      });
      setOpen(false);
    },
    onError: (error) => {
      toaster.error({
        title: 'Error creating task',
        description: error.message,
      });
      console.log('error', error);
    },
  });
  const { mutateAsync, isPending } = taskMutation;

  interface CreateTask {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId?: string;
    dueDate?: string;
  }
  const defaultTask: CreateTask = {
    title: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
  };

  const form = useForm({
    defaultValues: defaultTask,
    validators: { onChange: taskSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        dueDate: value.dueDate
          ? new Date(value.dueDate).toISOString()
          : undefined,
      };
      await mutateAsync(payload);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button size="sm">
          <FiPlus /> New Task
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <Dialog.Header>Create New Task</Dialog.Header>
              <Dialog.Body>
                <VStack gap={4}>
                  <form.Field
                    name="title"
                    children={(field) => (
                      <Field.Root invalid={!!field.state.meta.errors.length}>
                        <Field.Label>Task Title</Field.Label>
                        <Input
                          placeholder="Implement authentication flow"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <Field.ErrorText>
                          {field.state.meta.errors.map((error) => (
                            <em role="alert">{error?.message ?? ''}</em>
                          ))}
                        </Field.ErrorText>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="description"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          placeholder="Add JWT auth and login routes"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="status"
                    children={(field) => (
                      <Field.Root>
                        <Select.Root
                          positioning={{
                            strategy: 'fixed',
                            hideWhenDetached: true,
                          }}
                          collection={statusCollection}
                          value={[field.state.value]}
                          onValueChange={(e) =>
                            field.handleChange(e.value[0] as TaskStatus)
                          }
                        >
                          <Select.HiddenSelect />
                          <Select.Label>Status</Select.Label>
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Status" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content>
                              {statusCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="priority"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Priority</Field.Label>
                        <Select.Root
                          positioning={{
                            strategy: 'fixed',
                            hideWhenDetached: true,
                          }}
                          collection={priorityCollection}
                          value={[field.state.value]}
                          onValueChange={(e) =>
                            field.handleChange(e.value[0] as TaskPriority)
                          }
                        >
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select priority" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content>
                              {priorityCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="projectId"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Project (Optional)</Field.Label>
                        <Select.Root
                          positioning={{
                            strategy: 'fixed',
                            hideWhenDetached: true,
                          }}
                          collection={projectCollection}
                          value={field.state.value ? [field.state.value] : []}
                          onValueChange={(e) =>
                            field.handleChange(e.value[0] || undefined)
                          }
                        >
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select project" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content>
                              {projectCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="dueDate"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Due Date</Field.Label>
                        <Input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  />
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" loading={isPending}>
                  Create
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
