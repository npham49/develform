import AppLayout from '@/layouts/app-layout';
import { Form, FormType, Submission } from '@formio/react';
import { Head } from '@inertiajs/react';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';

interface SubmitSuccessProps {
  submission_id: number;
  form_name: string;
  submission_data: Submission;
  schema: string;
  created_at: string;
  token?: string;
}

export default function SubmitSuccess({ submission_id, form_name, submission_data, schema, created_at, token }: SubmitSuccessProps) {
  const formSchema = useRef<FormType>(JSON.parse(schema ?? '{}'));
  const [formReady, setFormReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFormReady(true);
  }, []);

  return (
    <AppLayout hideHeader>
      <Head title={`Submitted ${form_name}`} />
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="card-title mb-0">
                ✅ {form_name} - Submission ID: {submission_id}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-success mb-3">
                <strong>Success!</strong> Your submission has been received. Thank you for your time.
              </div>
              {token && (
                <div className="alert alert-info mb-3">
                  <strong>Anonymous Submission:</strong> You can view this submission using the following link (bookmark it to access later):
                  <br />
                  <small
                    className="text-muted"
                  >
                    {window.location.origin}/forms/{window.location.pathname.split('/')[2]}/submit/success/{submission_id}?token={token}
                  </small>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/forms/${window.location.pathname.split('/')[2]}/submit/success/${submission_id}?token=${token}`);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}
                    size="sm"
                    className="ms-2 rounded-pill"
                  >
                    {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
                  </Button>
                </div>
              )}
              <h6 className="mb-3">Submitted Data:</h6>
              {formReady && (
                <Form
                  src={formSchema.current}
                  submission={{ data: submission_data as { [key: string]: any } }} // eslint-disable-line @typescript-eslint/no-explicit-any
                  options={{ readOnly: true }}
                />
              )}
              <div className="mt-3">
                <small className="text-muted">Submitted on: {new Date(created_at).toLocaleString()}</small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
