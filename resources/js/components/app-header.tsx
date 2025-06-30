import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles = 'text-dark bg-light';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="border-bottom">
                <div className="mx-auto d-flex align-items-center px-4 h-16">
                    {/* Mobile Menu */}
                    <div className="d-lg-none">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="me-2 h-34 w-34">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="d-flex h-100 w-64 flex-column align-items-stretch justify-content-between bg-light">
                                <SheetTitle className="visually-hidden">Navigation Menu</SheetTitle>
                                <SheetHeader className="d-flex justify-content-start text-start">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-dark" />
                                </SheetHeader>
                                <div className="d-flex h-100 flex-1 flex-column gap-4 p-4">
                                    <div className="d-flex h-100 flex-column justify-content-between small">
                                        <div className="d-flex flex-column gap-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="d-flex align-items-center gap-2 fw-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="d-flex flex-column gap-4">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="d-flex align-items-center gap-2 fw-medium"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/dashboard" prefetch className="d-flex align-items-center gap-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ms-6 d-none h-100 align-items-center gap-6 d-lg-flex">
                        <NavigationMenu className="d-flex h-100 align-items-stretch">
                            <NavigationMenuList className="d-flex h-100 align-items-stretch gap-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="position-relative d-flex h-100 align-items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="me-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="position-absolute bottom-0 start-0 h-0-5 w-100 bg-dark"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ms-auto d-flex align-items-center gap-2">
                        <div className="position-relative d-flex align-items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
                                <Search className="opacity-80" />
                            </Button>
                            <div className="d-none d-lg-flex">
                                {rightNavItems.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-link btn-sm ms-1 h-9 w-9 d-inline-flex align-items-center justify-content-center rounded p-0"
                                                >
                                                    <span className="visually-hidden">{item.title}</span>
                                                    {item.icon && <Icon iconNode={item.icon} className="opacity-80" />}
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="rounded-circle p-1" style={{ width: '40px', height: '40px' }}>
                                    <Avatar className="overflow-hidden rounded-circle" style={{ width: '32px', height: '32px' }}>
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded bg-light text-dark">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="d-flex w-100 border-bottom">
                    <div className="mx-auto d-flex h-12 w-100 align-items-center justify-content-start px-4 text-muted">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
