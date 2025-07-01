import { Form } from '@tsed/react-formio';

interface FormRendererProps {
  form?: object;
  submission?: object;
  onSubmit?: (submission: object) => void;
  onChange?: (submission: object) => void;
  options?: object;
  className?: string;
}

export function FormRenderer({ 
  form, 
  submission, 
  onSubmit, 
  onChange, 
  options, 
  className 
}: FormRendererProps) {
  return (
    <Form
      form={form}
      submission={submission}
      onSubmit={onSubmit}
      onChange={onChange}
      options={options}
      className={className}
    />
  );
}