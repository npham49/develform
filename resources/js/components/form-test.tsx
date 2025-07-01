import { FormBuilderWrapper } from '@/components/form-builder-wrapper';
import { FormRenderer } from '@/components/form-renderer';
import { useState } from 'react';

// Simple test component to verify the form builder and renderer work
export function FormTest() {
  const [formSchema] = useState<object | null>(null);
  const [submission, setSubmission] = useState<object>({});

  const handleSubmit = (submissionData: object) => {
    console.log('Form submitted:', submissionData);
    setSubmission(submissionData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Builder Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Form Builder (@tsed/react-formio)</h2>
        <div className="border border-gray-300 p-4 rounded">
          <FormBuilderWrapper />
        </div>
      </div>

      {formSchema && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Form Renderer</h2>
          <div className="border border-gray-300 p-4 rounded">
            <FormRenderer
              form={formSchema}
              submission={submission}
              onSubmit={handleSubmit}
              onChange={(submission) => console.log('Form changed:', submission)}
            />
          </div>
        </div>
      )}
    </div>
  );
}