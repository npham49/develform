import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Form, FormType } from '@formio/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/esm/Card';
import { toast } from 'sonner';

interface SubmitProps {
  schema: string;
  name: string;
  form_id: string;
}

export default function Submit({ schema, name, form_id }: SubmitProps) {
  const formSchema = useRef<FormType>(JSON.parse(schema ?? '{}'));
  const [formReady, setFormReady] = useState(false);

  const { auth } = usePage<SharedData>().props;

  // Check if user is logged in
  const isLoggedIn = !!auth.user;

  const { data, setData, post } = useForm({
    form_id: form_id,
    data: {},
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleChange = (value: any, flags: any, modified: boolean) => {
    // console.log(value, flags, modified);
    setData({ ...data, data: value.data });
    console.log(data);
  };

  const handleSubmit = () => {
    post(route('submit.store', { form: form_id }), {
      onSuccess: () => {
        toast.success('Submission created successfully');
      },
      onError: (e) => {
        console.log(e);
        toast.error('Failed to create submission');
      },
    });
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    setFormReady(true);

    return () => {
      setFormReady(false);
    };
  }, []);

  return (
    <AppLayout hideHeader>
      <Head title={`Submit ${name}`} />
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">{name}</h5>
            </Card.Header>
            <Card.Body>
              {!isLoggedIn ? (
                <div className="alert alert-info mb-3">
                  <strong>Note:</strong> This is an anonymous submission. Please do not enter sensitive information.
                </div>
              ) : (
                <div className="alert alert-info mb-3">
                  <strong>Note:</strong> Submitting as {auth.user.name}
                </div>
              )}
              {formReady && <Form src={formSchema.current} onChange={handleChange} onSubmit={handleSubmit} />}
            </Card.Body>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
