interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'normal';
  centered?: boolean;
}

export function LoadingSpinner({ text = 'Loading...', size = 'normal', centered = true }: LoadingSpinnerProps) {
  const spinnerClass = size === 'sm' ? 'spinner-border spinner-border-sm' : 'spinner-border';
  const content = (
    <>
      <div className={`${spinnerClass} text-primary`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </>
  );

  if (!centered) {
    return <div className="d-flex align-items-center">{content}</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="text-center">{content}</div>
    </div>
  );
}
