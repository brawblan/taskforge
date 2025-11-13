import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { FiFolderPlus } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ProjectFormFields from './ProjectFormFields';
import { toaster } from '@/components/ui/toaster';
import { POST } from '@/utilities/fetch';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters long'),
  description: z.string().optional(),
});

interface CreateProject {
  name: string;
  description?: string;
}

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const projectMutation = useMutation({
    mutationFn: (value: { name: string; description?: string }) =>
      POST('/projects', { ...value, ownerId: import.meta.env.VITE_USER_ID }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      form.reset();
      toaster.success({
        title: 'Project created',
        description: `"${data.name}" was successfully added.`,
      });
      setOpen(false);
    },
    onError: (error) => {
      toaster.error({
        title: 'Error creating project',
        description: error.message,
      });
      console.log('error', error);
    },
  });
  const { mutateAsync, isPending } = projectMutation;

  const defaultProject: CreateProject = { name: '' };

  const form = useForm({
    defaultValues: defaultProject,
    validators: { onChange: projectSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button size="sm">
          <FiFolderPlus /> New Project
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
              <Dialog.Header>Create New Project</Dialog.Header>
              <Dialog.Body>
                <form.Field name="name">
                  {(field) => (
                    <form.Field name="description">
                      {(descField) => (
                        <ProjectFormFields
                          nameField={field}
                          descriptionField={descField}
                        />
                      )}
                    </form.Field>
                  )}
                </form.Field>
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
