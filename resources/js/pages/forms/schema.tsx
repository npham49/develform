import { FormBuilderWrapper } from '@/components/form-builder-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { Head } from '@inertiajs/react';

interface FormsSchemaProps {
    form: Form;
}

export default function FormsSchema({ form }: FormsSchemaProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Forms',
            href: route('forms.index'),
        },
        {
            title: form.name,
            href: route('forms.manage', form.id),
        },
        {
            title: 'Schema',
            href: route('forms.schema', form.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Schema ${form.name}`} />
            <Card className="bg-background-bootstrap">
                <CardHeader>
                    <CardTitle>Schema: {form.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Form Details</h3>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <span className="font-medium">Name:</span> {form.name}
                                </div>
                            </div>
                        </div>
                        <div className="bg-background-bootstrap">
                            <FormBuilderWrapper />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
