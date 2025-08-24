import { Check, GitCompare } from 'lucide-react';
import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FormVersion } from '../../types/api';

interface VersionComparisonSelectorModalProps {
  show: boolean;
  onHide: () => void;
  versions: FormVersion[];
  onCompare: (version1: FormVersion, version2: FormVersion) => void;
}

/**
 * Modal for selecting two versions to compare.
 * Provides dropdowns to select two different versions and validates selection.
 */
export const VersionComparisonSelectorModal = ({ show, onHide, versions, onCompare }: VersionComparisonSelectorModalProps) => {
  const [selectedVersion1, setSelectedVersion1] = useState<string>('');
  const [selectedVersion2, setSelectedVersion2] = useState<string>('');

  const handleCompare = () => {
    const version1 = versions.find((v) => v.versionSha === selectedVersion1);
    const version2 = versions.find((v) => v.versionSha === selectedVersion2);

    if (version1 && version2) {
      onCompare(version1, version2);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedVersion1('');
    setSelectedVersion2('');
    onHide();
  };

  const canCompare = selectedVersion1 && selectedVersion2 && selectedVersion1 !== selectedVersion2;

  const getVersionLabel = (version: FormVersion) => {
    const sha = version.versionSha.slice(0, 8);
    const description = version.description || 'No description';
    const status = version.isPublished ? 'Published' : 'Draft';
    const date = new Date(version.createdAt).toLocaleDateString();

    return `${sha} - ${description} (${status}) - ${date}`;
  };

  // Sort versions by creation date (newest first)
  const sortedVersions = [...versions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <GitCompare size={20} className="me-2" />
          Compare Versions
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-4">
          <p className="text-muted">Select two versions to compare their schemas and see the differences between them.</p>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="fw-semibold">First Version</Form.Label>
              <Form.Select value={selectedVersion1} onChange={(e) => setSelectedVersion1(e.target.value)} size="lg">
                <option value="">Select first version...</option>
                {sortedVersions.map((version) => (
                  <option key={version.versionSha} value={version.versionSha} disabled={version.versionSha === selectedVersion2}>
                    {getVersionLabel(version)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="fw-semibold">Second Version</Form.Label>
              <Form.Select value={selectedVersion2} onChange={(e) => setSelectedVersion2(e.target.value)} size="lg">
                <option value="">Select second version...</option>
                {sortedVersions.map((version) => (
                  <option key={version.versionSha} value={version.versionSha} disabled={version.versionSha === selectedVersion1}>
                    {getVersionLabel(version)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </div>

        {selectedVersion1 === selectedVersion2 && selectedVersion1 && (
          <Alert variant="warning" className="mt-3">
            <small>Please select two different versions to compare.</small>
          </Alert>
        )}

        {canCompare && (
          <Alert variant="info" className="mt-3">
            <div className="d-flex align-items-center">
              <Check size={16} className="me-2" />
              <small>Ready to compare these two versions</small>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCompare} disabled={!canCompare}>
          <GitCompare size={16} className="me-2" />
          Compare Versions
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
