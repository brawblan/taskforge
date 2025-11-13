import { Button, CloseButton, Dialog, HStack, Portal } from '@chakra-ui/react';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import ProjectFormFields from './ProjectFormFields';
import type { Project } from '@/types/dashboard';
import { toaster } from '@/components/ui/toaster';
import { DELETE, PATCH } from '@/utilities/fetch';

const projectSchema = z.object({
  name: z
    .string()
    .min(2, 'Project name must be at least 2 characters long')
    .optional(),
  description: z.string().optional(),
});

interface EditProject extends Partial<Project> {
  id: string;
}

interface EditProjectDialogProps {
  project: EditProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (value: { name?: string; description?: string }) =>
      await PATCH(`/projects/${project.id}`, {
        ...value,
        ownerId: import.meta.env.VITE_USER_ID,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toaster.success({
        title: 'Project updated',
        description: `"${data.name}" was successfully updated.`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toaster.error({
        title: 'Error updating project',
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => await DELETE(`/projects/${project.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toaster.success({
        title: 'Project deleted',
        description: `"${project.name}" was successfully deleted.`,
      });
      onOpenChange(false);
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      toaster.error({
        title: 'Error deleting project',
        description: error.message,
      });
    },
  });

  const defaultProject: {
    name?: string;
    description?: string;
  } = {
    name: project.name,
    description: project.description,
  };

  const form = useForm({
    defaultValues: defaultProject,
    validators: { onChange: projectSchema },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(value);
    },
  });

  return (
    <>
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
                <Dialog.Header>Edit Project</Dialog.Header>
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
                  <HStack justify="space-between" width="full">
                    <Button
                      variant="outline"
                      colorPalette="red"
                      onClick={() => setShowDeleteConfirm(true)}
                      type="button"
                    >
                      <FiTrash2 /> Delete
                    </Button>
                    <HStack>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button type="submit" loading={updateMutation.isPending}>
                        Save Changes
                      </Button>
                    </HStack>
                  </HStack>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={showDeleteConfirm}
        onOpenChange={(e) => setShowDeleteConfirm(e.open)}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Delete Project</Dialog.Header>
              <Dialog.Body>
                Are you sure you want to delete "{project.name}"? This action
                cannot be undone.
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => deleteMutation.mutate()}
                  loading={deleteMutation.isPending}
                >
                  Delete Project
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
