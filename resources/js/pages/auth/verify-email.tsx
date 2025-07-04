// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('verification.send'));
  };

  return (
    <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
      <Head title="Email verification" />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-sm fw-medium text-success text-center">
          A new verification link has been sent to the email address you provided during registration.
        </div>
      )}

      <form onSubmit={submit} className="d-flex flex-column gap-3 text-center">
        <button type="button" disabled={processing} className="btn btn-secondary d-flex align-items-center justify-content-center gap-2">
          {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Resend verification email
        </button>

        <a
          href={route('logout')}
          className="text-sm mx-auto d-block text-decoration-none"
          onClick={(e) => {
            e.preventDefault();
            // Use Inertia's router for logout
            window.location.href = route('logout');
          }}
        >
          Log out
        </a>
      </form>
    </AuthLayout>
  );
}
