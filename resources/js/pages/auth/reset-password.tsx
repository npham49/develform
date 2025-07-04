import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
  token: string;
  email: string;
}

type ResetPasswordForm = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout title="Reset password" description="Please enter your new password below">
      <Head title="Reset password" />

      <form onSubmit={submit}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={data.email}
              className="form-control"
              readOnly
              onChange={(e) => setData('email', e.target.value)}
            />
            {errors.email && <div className="text-danger small mt-2">{errors.email}</div>}
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={data.password}
              className="form-control"
              autoFocus
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Password"
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="password_confirmation" className="form-label">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              value={data.password_confirmation}
              className="form-control"
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="Confirm password"
            />
            {errors.password_confirmation && <div className="text-danger small mt-2">{errors.password_confirmation}</div>}
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-100 d-flex align-items-center justify-content-center gap-2" disabled={processing}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Reset password
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
