import { Edit3 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';

interface CreateNewVersionButtonProps {
  formId: number;
  liveVersionSha?: string | null; // Optional since server handles the logic
}

/**
 * CreateNewVersionButton component handles creating a new draft version
 * The server automatically determines the base schema (live version or blank)
 * Redirects to the edit page for the newly created version
 */
export const CreateNewVersionButton = ({ formId }: CreateNewVersionButtonProps) => {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewVersion = useCallback(async () => {
    setCreating(true);

    try {
      // Create new draft version - server will determine base schema automatically
      const createResponse = await api.versions.create(formId, {
        publish: false,
        // No schema or description - server will determine these automatically
      });

      if (!createResponse.data) {
        throw new Error('Failed to create new version');
      }

      const newVersion = createResponse.data;
      toast.success('New draft version created successfully');

      // Redirect to edit the new version
      navigate({
        to: '/forms/$formId/versions/$versionId/edit',
        params: { formId: formId.toString(), versionId: newVersion.sha },
      });
    } catch (error: unknown) {
      console.error('Error creating new version:', error);
      toast.error((error as Error).message || 'Failed to create new version');
    } finally {
      setCreating(false);
    }
  }, [formId]);

  return (
    <Button
      variant="outline-primary"
      className="w-100 d-flex align-items-center justify-content-center"
      onClick={handleCreateNewVersion}
      disabled={creating}
    >
      <Edit3 size={18} className="me-2" />
      {creating ? 'Creating...' : 'Create New Version'}
    </Button>
  );
};
