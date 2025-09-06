import { useRouter } from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { FormVersion } from '../../types/api';
import { RevertOperation, VersionRevertModal } from './version-revert-modal';

interface VersionActionsToolbarProps {
  version: FormVersion;
  formId: number;
}

/**
 * Action buttons for version operations in the history tree.
 * Provides version options functionality for individual versions.
 */
export const VersionActionsToolbar = ({ version, formId }: VersionActionsToolbarProps) => {
  const [showRevertModal, setShowRevertModal] = useState(false);
  const router = useRouter();

  const handleRevert = () => {
    setShowRevertModal(true);
  };

  const handleRevertOperation = async (operation: RevertOperation, description?: string) => {
    try {
      switch (operation) {
        case 'force_reset':
          await api.versions.forceReset(formId, version.versionSha);
          toast.success('Force reset completed - all newer versions deleted');
          break;
        case 'make_live':
          await api.versions.makeLive(formId, version.versionSha);
          toast.success('Version set as live - history preserved');
          break;
        case 'make_latest': {
          const newVersionResponse = await api.versions.makeLatest(formId, version.versionSha, { description });
          toast.success('New draft version created from this version');

          // Navigate to edit the new draft version
          if (newVersionResponse.data && Array.isArray(newVersionResponse.data) && newVersionResponse.data.length > 0) {
            router.navigate({ to: `/forms/${formId}/versions/${newVersionResponse.data[0].versionSha}/edit` });
          } else {
            // Fallback to refreshing the page
            router.invalidate();
          }
          return;
        } // Don't reload page since we're navigating
      }

      // Refresh the page to show updated versions
      router.invalidate();
    } catch (error) {
      console.error('Revert operation failed:', error);
      toast.error('Revert operation failed');
    }
  };

  return (
    <div className="d-flex gap-2 mt-2">
      <Button variant="outline-secondary" size="sm" className="d-flex align-items-center" onClick={handleRevert}>
        <RotateCcw size={14} className="me-1" />
        Options
      </Button>

      {/* Revert Modal */}
      <VersionRevertModal show={showRevertModal} onHide={() => setShowRevertModal(false)} version={version} onRevert={handleRevertOperation} />
    </div>
  );
};
