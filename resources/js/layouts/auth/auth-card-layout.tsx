import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
  children,
  title,
  description,
}: PropsWithChildren<{
  name?: string;
  title?: string;
  description?: string;
}>) {
  return (
    <div className="gap-6 bg-muted p-6 md:p-10 flex min-h-svh flex-col items-center justify-center">
      <div className="max-w-md gap-6 flex w-full flex-col">
        <Link href={route('home')} className="gap-2 font-medium flex items-center self-center">
          <div className="h-9 w-9 flex items-center justify-center">
            <AppLogoIcon className="size-9 text-black dark:text-white fill-current" />
          </div>
        </Link>

        <div className="gap-6 flex flex-col">
          <Card className="rounded-xl">
            <CardHeader className="px-10 pt-8 pb-0 text-center">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-10 py-8">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
