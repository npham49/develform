import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Layers } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Badge, Button, Card, Container, Form } from 'react-bootstrap';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
      <Head title="Log in" />
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
              <Mail size={14} className="me-2" />
              Sign In Required
            </Badge>
            <h1 className="h3 fw-bold text-dark">Welcome back</h1>
            <p className="text-muted">Enter your credentials to access your account</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              {status && (
                <div className="alert alert-success mb-4 text-center">
                  {status}
                </div>
              )}

              {redirect !== null && (
                <div className="alert alert-info mb-4">
                  <strong>Authentication Required:</strong> You will be redirected to {redirect?.toString()} after logging in.
                </div>
              )}

              <Form onSubmit={submit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="position-relative">
                    <input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="Enter your email"
                      className={`form-control ps-5 ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    {canResetPassword && (
                      <Link href={route('password.request')} className="small text-decoration-none" tabIndex={5}>
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="position-relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Enter your password"
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
                  <div className="form-check">
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
                      Remember me for 30 days
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center mb-4"
                  size="lg"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && <LoaderCircle size={18} className="me-2 animate-spin" />}
                  {processing ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link 
                    href={route('register', { redirect: redirect ?? null })} 
                    tabIndex={5} 
                    className="text-decoration-none fw-semibold"
                  >
                    Sign up
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-muted small">
              Secure login powered by Flowable Forms
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
