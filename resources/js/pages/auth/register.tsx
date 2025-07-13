import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, Eye, EyeOff, Layers, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Badge, Button, Card, Container, Form } from 'react-bootstrap';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const { url } = usePage();
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  const redirect = urlParams.get('redirect');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register', { redirect: redirect ?? null }), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
      <Head title="Register" />
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '420px' }}>
          {/* Header */}
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                }}
              >
                <Layers size={24} color="#fff" />
              </div>
              <h3 className="mb-0 fw-bold text-dark">Flowable Forms</h3>
            </div>
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <UserPlus size={14} className="me-2" />
              Create Account
            </Badge>
            <h1 className="h3 fw-bold text-dark">Get started today</h1>
            <p className="text-muted">Create your account to start building amazing forms</p>
          </div>

          {/* Register Card */}
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              {redirect !== null && (
                <div className="alert alert-info mb-4">
                  <strong>Authentication Required:</strong> You will be redirected to {redirect?.toString()} after registration.
                </div>
              )}

              <Form onSubmit={submit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Full Name
                  </label>
                  <div className="position-relative">
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
                      placeholder="Enter your full name"
                      className={`form-control ps-5 ${errors.name ? 'is-invalid' : ''}`}
                    />
                    <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      id="email"
                      type="email"
                      required
                      tabIndex={2}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      disabled={processing}
                      placeholder="Enter your email"
                      className={`form-control ps-5 ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={3}
                      autoComplete="new-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      disabled={processing}
                      placeholder="Create a password"
                      className={`form-control ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
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
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      tabIndex={4}
                      autoComplete="new-password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      disabled={processing}
                      placeholder="Confirm your password"
                      className={`form-control ps-5 pe-5 ${errors.password_confirmation ? 'is-invalid' : ''}`}
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

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center mb-4"
                  size="lg"
                  tabIndex={5}
                  disabled={processing}
                >
                  {processing && <LoaderCircle size={18} className="me-2 animate-spin" />}
                  {processing ? 'Creating account...' : 'Create account'}
                </Button>

                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link 
                    href={route('login', { redirect: redirect ?? null })} 
                    tabIndex={6} 
                    className="text-decoration-none fw-semibold"
                  >
                    Sign in
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-muted small">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
