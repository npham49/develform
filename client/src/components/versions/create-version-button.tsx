import { useNavigate } from '@tanstack/react-router';
import { GitBranch } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { FormVersion } from '../../types/api';

interface CreateVersionButtonProps {
  formId: number;
  baseVersion?: FormVersion;
  variant?: string;
  size?: 'sm' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * Unified button component for creating new versions.
 * Handles both new versions (from latest) and versions from specific base.
 */
export const CreateVersionButton = ({
  formId,
  baseVersion,
  variant = 'outline-primary',
  size = 'sm',
  showIcon = true,
  children,
}: CreateVersionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateVersion = async () => {
    setIsLoading(true);
    try {
      const description = baseVersion
        ? `New version based on ${baseVersion.versionSha.slice(0, 8)} - ${baseVersion.description || 'no description'}`
        : 'New draft version';

      const response = await api.versions.create(formId, {
        description,
        publish: false,
        baseVersionSha: baseVersion?.versionSha,
      });

      toast.success('New draft version created successfully');

      navigate({
        to: '/forms/$formId/versions/$versionId/edit',
        params: {
          formId: formId.toString(),
          versionId: response.data.sha,
        },
      });
    } catch (error) {
      console.error('Failed to create new version:', error);
      toast.error('Failed to create new version');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = children || (baseVersion ? 'Create New Version' : 'Create New Version');

  return (
    <Button variant={variant} size={size} className="d-flex align-items-center" onClick={handleCreateVersion} disabled={isLoading}>
      {isLoading ? (
        <>
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          Creating...
        </>
      ) : (
        <>
          {showIcon && <GitBranch size={14} className="me-1" />}
          {buttonText}
        </>
      )}
    </Button>
  );
};
