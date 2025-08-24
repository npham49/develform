import { FormBuilder as FormioFormBuilder } from '@formio/js';
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { requireAuth } from '@/lib/auth-utils';
import { createDebounce } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

import { FormBuilder, type FormType } from '@formio/react';
import { ArrowLeft, Code, Save } from 'lucide-react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export const INITIAL_SCHEMA = { title: '', name: '', path: '', display: 'form' as const, type: 'form' as const, components: [] };

export const Route = createFileRoute('/forms/$formId/versions/$versionId/edit')({
  beforeLoad: ({ context }) => {
    requireAuth(context, window.location.pathname);
  },
  loader: async ({ params }) => {
    try {
      const formId = parseInt(params.formId);
      const versionId = params.versionId;

      // Get form data and specific version with schema
      const [formResponse, versionResponse] = await Promise.all([api.forms.get(formId), api.versions.get(formId, versionId)]);

      const form = formResponse.data;
      const version = versionResponse.data;

      // Only allow editing of unpublished versions
      if (version.isPublished) {
        throw new Error('Cannot edit published versions');
      }

      return { form, version };
    } catch (error) {
      console.error('Error loading form version for editing:', error);
      throw error;
    }
  },
  component: EditFormVersion,
  pendingComponent: () => <LoadingSpinner />,
});

function EditFormVersion() {
  const { form, version } = useLoaderData({ from: '/forms/$formId/versions/$versionId/edit' });

  const initialBuilderSchema = useRef<FormType>((version as { schema?: FormType }).schema || INITIAL_SCHEMA);
  const formBuilderRef = useRef<FormioFormBuilder>(null);
  const [processing, setProcessing] = useState(false);
  const [description, setDescription] = useState(version.description || '');

  const handleBuilderReady = useCallback((builder: FormioFormBuilder) => {
    formBuilderRef.current = builder;
  }, []);

  // Simple change tracking - no schema comparison needed
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Saves current FormBuilder schema to server.
   * Called by debounce after user stops making changes.
   */
  const triggerAutoSave = useCallback(async () => {
    console.log('hey debounce completed');
    if (!formBuilderRef.current || !form || !version) return;

    const currentSchema = formBuilderRef.current.instance.schema;
    console.log('[Editor] Auto-save triggered');

    try {
      await api.versions.update(form.id, version.versionSha, {
        schema: currentSchema,
        description: version.description || 'Auto-saved',
      });

      // Mark as saved
      setHasUnsavedChanges(false);
      console.log('[Editor] Auto-save completed successfully');
    } catch (error: unknown) {
      console.error('Auto-save failed:', error);
    }
  }, [form, version]);

  // Create debounced auto-save handler with 5-second delay
  const autoSaveDebounce = useMemo(() => createDebounce(triggerAutoSave, 5000), [triggerAutoSave]);

  /**
   * Handles FormBuilder schema changes by marking as unsaved and triggering auto-save.
   * FormIO only fires this on actual changes (save/delete components).
   */
  const handleSchemaChange = useCallback(() => {
    console.log('[Editor] Schema changed - marking as unsaved and triggering auto-save');
    setHasUnsavedChanges(true);
    autoSaveDebounce.execute();
  }, [autoSaveDebounce]);

  const handleUpdateVersionDetails = async () => {
    if (!form || !version) return;
    setProcessing(true);

    try {
      await api.versions.update(form.id, version.versionSha, {
        description: description ?? version.description,
      });

      toast.success('Version details updated successfully');
    } catch (error: unknown) {
      console.error('Error updating version details:', error);
      toast.error((error as Error).message ?? 'Failed to update version details');
    } finally {
      setProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!form || !version) return;
    setProcessing(true);

    try {
      // Clear any pending auto-save
      autoSaveDebounce.cleanup();

      // Get current schema from FormBuilder
      let currentSchema;
      if (formBuilderRef.current) {
        currentSchema = formBuilderRef.current.instance.schema;
      } else {
        toast.error('No schema to publish');
        return;
      }

      if (!currentSchema) {
        toast.error('No schema to publish');
        return;
      }

      // First update the version with current schema
      await api.versions.update(form.id, version.versionSha, {
        schema: currentSchema,
        description: description || version.description || 'Published version',
      });

      // Mark as saved
      setHasUnsavedChanges(false);

      // Then publish it
      await api.versions.publish(form.id, version.versionSha);

      toast.success('Version published successfully');

      // Redirect to manage page after publishing
      window.location.href = `/forms/${form.id}/manage`;
    } catch (error: unknown) {
      console.error('Error publishing version:', error);
      toast.error((error as Error).message || 'Failed to publish version');
    } finally {
      setProcessing(false);
    }
  };

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      autoSaveDebounce.cleanup();
    };
  }, [autoSaveDebounce]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: '/forms',
    },
    {
      title: form.name,
      href: `/forms/${form.id}/manage`,
    },
    {
      title: `Edit Version ${version.versionSha.slice(0, 8)}`,
      href: `/forms/${form.id}/versions/${version.versionSha}/edit`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-4" fluid="xxl">
          <PageHeader
            badge={{ icon: Code, text: 'Form Builder' }}
            title={`Edit Version ${version.versionSha.slice(0, 8)}`}
            description={`Editing draft version: ${version.description || 'Untitled version'}`}
          />

          {/* Version Info Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <h6 className="fw-bold text-dark mb-1">Version Details</h6>
                      <p className="text-muted small mb-0">
                        Version SHA: <code>{version.versionSha}</code> • Status: <span className="badge bg-warning">Draft</span>
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 justify-content-end">
                    <Link to="/forms/$formId/manage" params={{ formId: form.id.toString() }} className="text-decoration-none">
                      <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                        <ArrowLeft size={16} className="me-2" />
                        Back to Manage
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
              <Row>
                {/* Description Card */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Version Description (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Describe your changes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={processing}
                  />
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleUpdateVersionDetails()}
                    disabled={processing}
                    className="d-flex align-items-center"
                  >
                    <Save size={16} className="me-2" />
                    Update Version Description
                  </Button>
                  <Button variant="primary" onClick={handlePublish} disabled={processing} className="d-flex align-items-center">
                    Publish Version
                  </Button>
                </div>
              </Row>
            </Card.Body>
          </Card>

          {/* Form Builder Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold">
                    <Code size={16} className="me-2" />
                    Form Schema Editor
                  </h5>
                  <p className="text-muted small mb-0">Drag and drop components to build your form</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {hasUnsavedChanges && autoSaveDebounce.isPending() && <span className="badge bg-warning text-dark">Saving...</span>}
                  {hasUnsavedChanges && !autoSaveDebounce.isPending() && <span className="badge bg-danger text-white">Unsaved changes</span>}
                  {!hasUnsavedChanges && <span className="badge bg-success text-white">All changes saved</span>}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="px-2">
              <div style={{ minHeight: '600px' }}>
                <FormBuilder
                  initialForm={initialBuilderSchema.current}
                  onSaveComponent={handleSchemaChange}
                  onDeleteComponent={handleSchemaChange}
                  onBuilderReady={handleBuilderReady}
                />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </AppLayout>
  );
}
