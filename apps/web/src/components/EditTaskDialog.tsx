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
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/types/dashboard';
import { toaster } from '@/components/ui/toaster';
import { PATCH } from '@/utilities/fetch';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TaskPriority,
  TaskStatus,
} from '@/types/task';

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

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: task.title,
      description: task.description ?? undefined,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : undefined,
    },
    onSubmit: async ({ value }) => {
      const payload: Partial<Task> = {
        ...value,
        dueDate: value.dueDate
          ? new Date(value.dueDate).toISOString()
          : undefined,
      } as Partial<Task>;
      await mutateAsync(payload);
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (value: Partial<Task>) =>
      await PATCH(`/tasks/${task.id}`, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      toaster.success({
        title: 'Task updated',
        description: `"${data.title}" was successfully updated.`,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toaster.error({
        title: 'Error updating task',
        description: error.message,
      });
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
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
              <Dialog.Header>Edit Task</Dialog.Header>
              <Dialog.Body>
                <VStack gap={4}>
                  <form.Field name="title">
                    {(field) => (
                      <Field.Root invalid={!!field.state.meta.errors.length}>
                        <Field.Label>Title</Field.Label>
                        <Input
                          placeholder="Task title"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors.join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="description">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          placeholder="Details..."
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="status">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
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
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select status" />
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
                  </form.Field>

                  <form.Field name="priority">
                    {(field) => (
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
                  </form.Field>

                  <form.Field name="dueDate">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Due Date</Field.Label>
                        <Input
                          type="date"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  </form.Field>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" loading={isPending}>
                  Save Changes
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
