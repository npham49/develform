import { FormBuilder } from '@tsed/react-formio';
import { ComponentSchema } from 'formiojs';
import { useState } from 'react';

export function FormBuilderWrapper() {
  const [components, setComponents] = useState<ComponentSchema[]>([]);

  const handleChange = (updatedComponents: ComponentSchema[]) => {
    setComponents(updatedComponents);
  };

  return (
    <FormBuilder
      components={components}
      display="form"
      onChange={handleChange}
      options={{
        builder: {
          premium: false,
          noDefaultSubmitButton: false,
        },
      }}
    />
  );
}
