import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Form {
    id: number;
    name: string;
    description: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

interface FormsIndexProps {
    forms: Form[];
}

export default function FormsIndex({ forms }: FormsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Forms',
            href: '/forms',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Forms" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link as="a" href={route('forms.create')} className='ml-auto'>
                    <Button className='cursor-pointer' variant={'outline'}>Create Form</Button>
                </Link>
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Description</th>
                            <th className="text-left p-2">Public</th>
                            <th className="text-left p-2">Created At</th>
                            <th className="text-left p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form) => (
                            <tr key={form.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{form.name}</td>
                                <td className="p-2">{form.description || 'No description'}</td>
                                <td className="p-2">{form.is_public ? 'Yes' : 'No'}</td>
                                <td className="p-2">{new Date(form.created_at).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <Link href={route('forms.manage', form.id)}>
                                        <Button variant="outline" size="sm">
                                            Manage
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {forms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No forms found. Create your first form to get started.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
