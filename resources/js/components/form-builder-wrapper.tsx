import { FormBuilder } from '@tsed/react-formio';
import { useState } from 'react';

export function FormBuilderWrapper() {
  const [components, setComponents] = useState([]);

  const handleChange = (updatedComponents: any) => {
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
