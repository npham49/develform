import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password settings',
    href: '/settings/password',
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Password settings" />

      <SettingsLayout>
        <div className="d-flex flex-column gap-4">
          <div className="mb-4">
            <h4 className="fw-semibold">Update password</h4>
            <p className="text-muted mb-0">Ensure your account is using a long, random password to stay secure</p>
          </div>

          <form onSubmit={updatePassword} className="d-flex flex-column gap-4">
            <div className="mb-3">
              <label htmlFor="current_password" className="form-label">
                Current password
              </label>
              <input
                id="current_password"
                ref={currentPasswordInput}
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                type="password"
                className="form-control"
                autoComplete="current-password"
                placeholder="Current password"
              />
              {errors.current_password && <div className="text-danger small mt-1">{errors.current_password}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New password
              </label>
              <input
                id="password"
                ref={passwordInput}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                type="password"
                className="form-control"
                autoComplete="new-password"
                placeholder="New password"
              />
              {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm password
              </label>
              <input
                id="password_confirmation"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                type="password"
                className="form-control"
                autoComplete="new-password"
                placeholder="Confirm password"
              />
              {errors.password_confirmation && <div className="text-danger small mt-1">{errors.password_confirmation}</div>}
            </div>

            <div className="d-flex align-items-center gap-3">
              <button type="submit" disabled={processing} className="btn btn-primary">
                Save password
              </button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-muted small">Saved</p>
              </Transition>
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
