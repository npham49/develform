import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="gap-6 bg-background p-6 md:p-10 flex min-h-svh flex-col items-center justify-center">
      <div className="max-w-sm w-full">
        <div className="gap-8 flex flex-col">
          <div className="gap-4 flex flex-col items-center">
            <Link href={route('home')} className="gap-2 font-medium flex flex-col items-center">
              <div className="mb-1 h-9 w-9 rounded-md flex items-center justify-center">
                <AppLogoIcon className="size-9 dark:text-white fill-current text-[var(--foreground)]" />
              </div>
              <span className="sr-only">{title}</span>
            </Link>

            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="text-sm text-muted-foreground text-center">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
