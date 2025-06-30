import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  title?: string;
  description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
  const { name, quote } = usePage<SharedData>().props;

  return (
    <div className="px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 relative grid h-dvh flex-col items-center justify-center">
      <div className="bg-muted p-10 text-white lg:flex relative hidden h-full flex-col dark:border-r">
        <div className="inset-0 bg-zinc-900 absolute" />
        <Link href={route('home')} className="text-lg font-medium relative z-20 flex items-center">
          <AppLogoIcon className="mr-2 size-8 text-white fill-current" />
          {name}
        </Link>
        {quote && (
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
              <footer className="text-sm text-neutral-300">{quote.author}</footer>
            </blockquote>
          </div>
        )}
      </div>
      <div className="lg:p-8 w-full">
        <div className="space-y-6 sm:w-[350px] mx-auto flex w-full flex-col justify-center">
          <Link href={route('home')} className="lg:hidden relative z-20 flex items-center justify-center">
            <AppLogoIcon className="h-10 text-black sm:h-12 fill-current" />
          </Link>
          <div className="gap-2 sm:items-center sm:text-center flex flex-col items-start text-left">
            <h1 className="text-xl font-medium">{title}</h1>
            <p className="text-sm text-muted-foreground text-balance">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
