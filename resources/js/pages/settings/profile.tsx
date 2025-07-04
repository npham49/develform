import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

type ProfileForm = {
  name: string;
  email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
    name: auth.user.name,
    email: auth.user.email,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="d-flex flex-column gap-4">
          <div className="mb-4">
            <h4 className="fw-semibold">Profile information</h4>
            <p className="text-muted mb-0">Update your name and email address</p>
          </div>

          <form onSubmit={submit} className="d-flex flex-column gap-4">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                className="form-control"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoComplete="name"
                placeholder="Full name"
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
                placeholder="Email address"
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </div>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div className="alert alert-warning">
                <p className="mb-2">
                  Your email address is unverified.{' '}
                  <Link href={route('verification.send')} method="post" as="button" className="text-decoration-none fw-medium">
                    Click here to resend the verification email.
                  </Link>
                </p>

                {status === 'verification-link-sent' && (
                  <div className="text-success fw-medium">A new verification link has been sent to your email address.</div>
                )}
              </div>
            )}

            <div className="d-flex align-items-center gap-3">
              <button type="submit" disabled={processing} className="btn btn-primary">
                Save
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

        <div className="mt-5 pt-4 border-top">
          <div className="mb-4">
            <h4 className="fw-semibold text-danger">Delete Account</h4>
            <p className="text-muted mb-0">This action cannot be undone. All data will be permanently removed.</p>
          </div>
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
