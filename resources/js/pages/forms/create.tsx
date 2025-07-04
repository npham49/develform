import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Form',
    href: route('forms.create'),
  },
];

export default function FormsCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    is_public: Boolean(false),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('forms.store'), {
      onSuccess: () => {
        toast.success('Form created successfully');
      },
      onError: () => {
        toast.error('Failed to create form');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Form" />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Create Form</h5>
        </div>
        <div className="card-body">
          <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="form-control" />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="form-control"
                rows={3}
              />
              {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="is_public"
                checked={data.is_public}
                onChange={(e) => setData('is_public', e.target.checked)}
                className="form-check-input"
                id="is_public"
              />
              <label className="form-check-label" htmlFor="is_public">
                Is Public
              </label>
              {errors.is_public && <div className="text-danger small mt-1">{errors.is_public}</div>}
            </div>

            <button type="submit" disabled={processing} className="btn btn-primary d-flex align-items-center justify-content-center gap-2">
              {processing ? 'Processing...' : 'Create Form'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
