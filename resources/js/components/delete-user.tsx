import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    clearErrors();
    reset();
  };

  return (
    <div className="d-flex flex-column gap-4">
      <HeadingSmall title="Delete account" description="Delete your account and all of its resources" />
      <div className="d-flex flex-column gap-3 rounded border-danger bg-danger bg-opacity-10 p-4 border">
        <div className="d-flex flex-column gap-1 text-danger">
          <p className="fw-medium">Warning</p>
          <p className="small">Please proceed with caution, this cannot be undone.</p>
        </div>

        <Dialog>
          <DialogTrigger>
            Delete account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
              <DialogDescription>
                Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you
                would like to permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            <form className="d-flex flex-column gap-4" onSubmit={deleteUser}>
              <div className="d-flex flex-column gap-2">
                <Label htmlFor="password" className="visually-hidden">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  ref={passwordInput}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />

                <InputError message={errors.password} />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button variant="destructive" disabled={processing} type="submit">
                  Delete account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
