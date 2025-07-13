import { Form, FormType, Submission } from '@formio/react';
import { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/esm/Card';

interface SubmitProps {
  schema: string;
  name: string;
}

export default function Submit({ schema, name }: SubmitProps) {
  const formSchema = useRef<FormType>(JSON.parse(schema ?? '{}'));
  const [data, setData] = useState({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any, flags: any, modified: boolean) => {
    console.log(value, flags, modified);
    setData(value.data);
  };

  const handleSubmit = (submission: Submission) => {
    console.log(submission);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <Card>
          <Card.Header>
            <h5 className="card-title mb-0">{name}</h5>
          </Card.Header>
          <Card.Body>
            <Form src={formSchema.current} onChange={handleChange} onSubmit={handleSubmit} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
