// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout title="Confirm your password" description="This is a secure area of the application. Please confirm your password before continuing.">
      <Head title="Confirm password" />

      <form onSubmit={submit}>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={data.password}
              autoFocus
              onChange={(e) => setData('password', e.target.value)}
              className="form-control"
            />

            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </div>

          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Confirm password
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
