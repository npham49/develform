import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout title="Create an account" description="Enter your details below to create your account">
      <Head title="Register" />
      <form className="d-flex flex-column gap-4" onSubmit={submit}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoFocus
              tabIndex={1}
              autoComplete="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              disabled={processing}
              placeholder="Full name"
              className="form-control"
            />
            {errors.name && <div className="text-danger small mt-2">{errors.name}</div>}
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              tabIndex={2}
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              disabled={processing}
              placeholder="email@example.com"
              className="form-control"
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              tabIndex={3}
              autoComplete="new-password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              disabled={processing}
              placeholder="Password"
              className="form-control"
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
              required
              tabIndex={4}
              autoComplete="new-password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              disabled={processing}
              placeholder="Confirm password"
              className="form-control"
            />
            {errors.password_confirmation && <div className="text-danger small">{errors.password_confirmation}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-2 w-100 d-flex align-items-center justify-content-center gap-2"
            tabIndex={5}
            disabled={processing}
          >
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Create account
          </button>
        </div>

        <div className="small text-muted text-center">
          Already have an account?{' '}
          <a href={route('login')} tabIndex={6} className="text-decoration-none">
            Log in
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
