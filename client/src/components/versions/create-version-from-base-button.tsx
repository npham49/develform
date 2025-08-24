import { useNavigate } from '@tanstack/react-router';
import { GitBranch } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { FormVersion } from '../../types/api';

interface CreateVersionFromBaseButtonProps {
  formId: number;
  baseVersion: FormVersion;
  variant?: 'primary' | 'outline-primary' | 'outline-secondary' | 'outline-success';
  size?: 'sm' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * Button component for creating a new draft version based on any existing version's schema.
 * Allows branching from any point in version history.
 */
export const CreateVersionFromBaseButton = ({
  formId,
  baseVersion,
  variant = 'outline-primary',
  size = 'sm',
  showIcon = true,
  children,
}: CreateVersionFromBaseButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateVersion = async () => {
    setIsLoading(true);
    try {
      // Create new version based on the selected version's schema
      const response = await api.versions.create(formId, {
        description: `New version based on ${baseVersion.versionSha.slice(0, 8)} - ${baseVersion.description || 'no description'}`,
        publish: false, // Always create as draft
        baseVersionSha: baseVersion.versionSha, // Pass the base version SHA to server
      });

      toast.success('New draft version created successfully');

      // Navigate to edit the new version
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
          {children || 'Create New Version'}
        </>
      )}
    </Button>
  );
};
