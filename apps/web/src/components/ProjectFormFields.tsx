import { Field, Input, Textarea, VStack } from '@chakra-ui/react';

interface ProjectFormFieldsProps {
  nameField: any;
  descriptionField: any;
}
export default function ProjectFormFields({
  nameField,
  descriptionField,
}: ProjectFormFieldsProps) {
  return (
    <VStack gap={4}>
      <Field.Root invalid={!!nameField.state.meta.errors.length}>
        <Field.Label>Project Name</Field.Label>
        <Input
          placeholder="My Awesome Project"
          value={nameField.state.value}
          onChange={(e) => nameField.handleChange(e.target.value)}
        />
        <Field.ErrorText>
          {nameField.state.meta.errors.map((error: Error) => (
            <em role="alert">{error.message || ''}</em>
          ))}
        </Field.ErrorText>
      </Field.Root>

      <Field.Root>
        <Field.Label>Description</Field.Label>
        <Textarea
          placeholder="Describe what this project is for..."
          value={descriptionField.state.value}
          onChange={(e) => descriptionField.handleChange(e.target.value)}
        />
      </Field.Root>
    </VStack>
  );
}
