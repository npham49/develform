import { Link } from '@tanstack/react-router';
import { Edit3, Eye, GitCompare } from 'lucide-react';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FormVersion } from '../../types/api';
import { CreateVersionFromBaseButton } from './create-version-from-base-button';
import { VersionActionsToolbar } from './version-actions-toolbar';
import { VersionComparisonModal } from './version-comparison-modal';
import { VersionComparisonSelectorModal } from './version-comparison-selector-modal';

interface VersionHistoryTreeProps {
  formId: number;
  versions: FormVersion[];
  liveVersionSha: string | null;
  onVersionSelect?: (version: FormVersion) => void;
  showActions?: boolean;
}

/**
 * Interactive version history tree with comprehensive version management features.
 * Displays chronological version timeline with comparison, revert, and edit capabilities.
 */
export const VersionHistoryTree = ({ formId, versions, liveVersionSha, onVersionSelect, showActions = false }: VersionHistoryTreeProps) => {
  const [showComparisonSelector, setShowComparisonSelector] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedVersionsForComparison, setSelectedVersionsForComparison] = useState<[FormVersion, FormVersion] | null>(null);

  const handleCompareVersions = (version1: FormVersion, version2: FormVersion) => {
    setSelectedVersionsForComparison([version1, version2]);
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedVersionsForComparison(null);
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white py-3 d-flex align-items-center justify-content-between">
        <div>
          <h5 className="mb-0 fw-semibold">Version History</h5>
          <p className="text-muted mb-0 small">Chronological history of all form versions</p>
        </div>
        {versions.length >= 2 && (
          <Button variant="outline-info" size="sm" onClick={() => setShowComparisonSelector(true)} className="d-flex align-items-center">
            <GitCompare size={16} className="me-2" />
            Compare Versions
          </Button>
        )}
      </Card.Header>

      <Card.Body className="p-0">
        <div>
          {versions.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <p className="mb-0">No versions available</p>
                <small>Create your first version to see history here</small>
              </div>
            </div>
          ) : (
            <div className="p-3">
              {versions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((version, index) => (
                  <div key={version.versionSha} className="mb-3">
                    {/* Version Card */}
                    <div className={`card border border-light ${onVersionSelect ? 'cursor-pointer' : ''}`} onClick={() => onVersionSelect?.(version)}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <code className="bg-light px-2 py-1 rounded me-2">{version.versionSha.slice(0, 8)}</code>
                              {version.versionSha === liveVersionSha && <span className="badge bg-success me-2">LIVE</span>}
                              {version.isPublished && version.versionSha !== liveVersionSha && (
                                <span className="badge bg-primary me-2">PUBLISHED</span>
                              )}
                              {!version.isPublished && <span className="badge bg-secondary me-2">DRAFT</span>}
                            </div>

                            <div className="mb-2">
                              <div className="fw-medium">{version.description || 'No description'}</div>
                              <small className="text-muted">
                                {new Date(version.createdAt).toLocaleString()}
                                {version.author && ` • ${version.author.name}`}
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Phase 3 Actions */}
                        {showActions && (
                          <div className="d-flex flex-column gap-2">
                            {/* Edit/Create Version Actions */}
                            <div className="d-flex gap-2">
                              {(() => {
                                // Find latest version by creation date
                                const latestVersion = versions.reduce((latest, current) =>
                                  new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime() ? current : latest,
                                );
                                const isLatestVersion = version.versionSha === latestVersion.versionSha;
                                const isLatestDraft = isLatestVersion && !version.isPublished;

                                return (
                                  <>
                                    {/* Edit button only for latest draft */}
                                    {isLatestDraft && (
                                      <Link
                                        to="/forms/$formId/versions/$versionId/edit"
                                        params={{ formId: formId.toString(), versionId: version.versionSha }}
                                        className="text-decoration-none"
                                      >
                                        <Button variant="primary" size="sm" className="d-flex align-items-center">
                                          <Edit3 size={14} className="me-1" />
                                          Edit Draft
                                        </Button>
                                      </Link>
                                    )}

                                    {/* Preview button for all versions */}
                                    <Link
                                      to="/forms/$formId/versions/$versionId/preview"
                                      params={{ formId: formId.toString(), versionId: version.versionSha }}
                                      className="text-decoration-none"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="outline-info" size="sm" className="d-flex align-items-center">
                                        <Eye size={14} className="me-1" />
                                        Preview
                                      </Button>
                                    </Link>

                                    {/* Create New Version only for latest version */}
                                    {isLatestVersion && (
                                      <CreateVersionFromBaseButton formId={formId} baseVersion={version} variant="outline-secondary" size="sm">
                                        Create New Version
                                      </CreateVersionFromBaseButton>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            {/* Version Options */}
                            <VersionActionsToolbar version={version} formId={formId} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline connector */}
                    {index < versions.length - 1 && (
                      <div className="text-center py-2">
                        <div className="border-start border-2 border-light" style={{ height: '20px', marginLeft: '20px' }} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card.Body>

      {/* Version Comparison Selector Modal */}
      <VersionComparisonSelectorModal
        show={showComparisonSelector}
        onHide={() => setShowComparisonSelector(false)}
        versions={versions}
        onCompare={handleCompareVersions}
      />

      {/* Version Comparison Modal */}
      {selectedVersionsForComparison && (
        <VersionComparisonModal show={showComparison} onHide={handleCloseComparison} versions={selectedVersionsForComparison} formId={formId} />
      )}

      <Card.Footer className="bg-light text-center py-2">
        <small className="text-muted">
          {versions.length} version{versions.length !== 1 ? 's' : ''} total
        </small>
      </Card.Footer>
    </Card>
  );
};
