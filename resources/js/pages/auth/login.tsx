import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { url } = usePage();
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  const redirect = urlParams.get('redirect');

  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login', { redirect: redirect ?? null }), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
      <Head title="Log in" />

      <form className="d-flex flex-column gap-4" onSubmit={submit}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            {redirect !== null && (
              <div className="alert alert-info mb-3"> This form requires authentication. You will be redirected to {redirect?.toString()} after logging in.</div>
            )}
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              tabIndex={1}
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="email@example.com"
              className="form-control"
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>

          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              {canResetPassword && (
                <a href={route('password.request')} className="small ms-auto text-decoration-none" tabIndex={5}>
                  Forgot password?
                </a>
              )}
            </div>
            <input
              id="password"
              type="password"
              required
              tabIndex={2}
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="Password"
              className="form-control"
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>

          <div className="form-check d-flex align-items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={data.remember}
              onChange={() => setData('remember', !data.remember)}
              tabIndex={3}
              className="form-check-input"
            />
            <label htmlFor="remember" className="form-check-label">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-2 w-100 d-flex align-items-center justify-content-center gap-2"
            tabIndex={4}
            disabled={processing}
          >
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Log in
          </button>
        </div>

        <div className="small text-muted text-center">
          Don't have an account?{' '}
          <Link href={route('register', { redirect: redirect ?? null })} tabIndex={5} className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </form>

      {status && <div className="mb-4 text-sm fw-medium text-success text-center">{status}</div>}
    </AuthLayout>
  );
}
