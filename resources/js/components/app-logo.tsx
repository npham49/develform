import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center rounded bg-primary text-white aspect-square"
        style={{ width: '32px', height: '32px' }}
      >
        <AppLogoIcon className="text-white fill-current" style={{ width: '20px', height: '20px' }} />
      </div>
      <div className="ms-1 d-flex small flex-1 text-start">
        <span className="mb-0-5 text-truncate fw-semibold">Laravel Starter Kit</span>
      </div>
    </>
  );
}
