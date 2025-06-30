import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast} from 'sonner';

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
            <Card>
                <CardHeader>
                    <CardTitle>Create Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <Label>Name</Label>
                        <Input name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                        <Label>Description</Label>
                        <Textarea name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                        <Label>Is Public</Label>
                        <Switch name="is_public" checked={data.is_public} onCheckedChange={(checked: boolean) => setData('is_public', checked)} />
                        <InputError message={errors.is_public} />
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Processing...' : 'Create Form'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
