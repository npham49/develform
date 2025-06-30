import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="d-flex aspect-square align-items-center justify-content-center rounded bg-primary text-white" style={{ width: '32px', height: '32px' }}>
                <AppLogoIcon className="fill-current text-white" style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="ms-1 d-flex flex-1 text-start small">
                <span className="mb-0-5 text-truncate fw-semibold">Laravel Starter Kit</span>
            </div>
        </>
    );
}
