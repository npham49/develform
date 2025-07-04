// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.email'));
  };

  return (
    <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
      <Head title="Forgot password" />

      {status && <div className="mb-4 text-sm fw-medium text-success text-center">{status}</div>}

      <div className="d-flex flex-column gap-4">
        <form onSubmit={submit}>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              value={data.email}
              autoFocus
              onChange={(e) => setData('email', e.target.value)}
              placeholder="email@example.com"
              className="form-control"
            />

            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>

          <div className="my-4 d-flex align-items-center justify-content-start">
            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Email password reset link
            </button>
          </div>
        </form>

        <div className="text-sm text-muted text-center">
          <span>Or, return to </span>
          <a href={route('login')} className="text-decoration-none">
            log in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
