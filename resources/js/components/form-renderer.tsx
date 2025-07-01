import { Form } from '@tsed/react-formio';

interface FormRendererProps {
  form?: any;
  submission?: any;
  onSubmit?: (submission: any) => void;
  onChange?: (submission: any) => void;
  options?: any;
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