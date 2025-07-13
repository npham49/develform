import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { Badge, Button, Card, Container } from 'react-bootstrap';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password settings',
    href: '/settings/password',
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Lock size={16} className="me-2" />
              Password Security
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Update Your Password</h1>
            <p className="lead text-muted">
              Keep your account secure with a strong password
            </p>
          </div>

          <SettingsLayout>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ width: 40, height: 40, backgroundColor: '#dcfce7' }}
                  >
                    <Shield size={20} className="text-success" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Change Password</h5>
                    <p className="text-muted small mb-0">Ensure your account is using a long, random password to stay secure</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <form onSubmit={updatePassword}>
                  <div className="mb-4">
                    <label htmlFor="current_password" className="form-label fw-semibold">
                      Current Password
                    </label>
                    <div className="position-relative">
                      <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className={`form-control ps-5 pe-5 ${errors.current_password ? 'is-invalid' : ''}`}
                        autoComplete="current-password"
                        placeholder="Enter your current password"
                      />
                      <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </button>
                      {errors.current_password && <div className="invalid-feedback">{errors.current_password}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type={showNewPassword ? 'text' : 'password'}
                        className={`form-control ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                        autoComplete="new-password"
                        placeholder="Create a new password"
                      />
                      <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password_confirmation" className="form-label fw-semibold">
                      Confirm New Password
                    </label>
                    <div className="position-relative">
                      <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ps-5 pe-5 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                      />
                      <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </button>
                      {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                    </div>
                  </div>

                  <div className="p-3 rounded mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="fw-semibold mb-2">Password Requirements</h6>
                    <ul className="text-muted small mb-0 ps-3">
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <Button type="submit" disabled={processing} variant="primary" className="d-flex align-items-center">
                      {processing ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} className="me-2" />
                          Update Password
                        </>
                      )}
                    </Button>

                    <Transition
                      show={recentlySuccessful}
                      enter="transition ease-in-out"
                      enterFrom="opacity-0"
                      leave="transition ease-in-out"
                      leaveTo="opacity-0"
                    >
                      <div className="d-flex align-items-center text-success">
                        <CheckCircle size={16} className="me-1" />
                        <span className="small fw-semibold">Password updated successfully</span>
                      </div>
                    </Transition>
                  </div>
                </form>
              </Card.Body>
            </Card>

            {/* Security Tips */}
            <Card className="shadow-sm border-0 mt-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Security Tips</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#dbeafe' }}
                    >
                      <span className="fw-bold text-primary small">1</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Use a password manager</div>
                      <div className="text-muted small">Generate and store unique passwords for all your accounts</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#dcfce7' }}
                    >
                      <span className="fw-bold text-success small">2</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Enable two-factor authentication</div>
                      <div className="text-muted small">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#ede9fe' }}
                    >
                      <span className="fw-bold text-purple small">3</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Update regularly</div>
                      <div className="text-muted small">Change your password if you suspect it may be compromised</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </SettingsLayout>
        </Container>
      </div>
    </AppLayout>
  );
}
