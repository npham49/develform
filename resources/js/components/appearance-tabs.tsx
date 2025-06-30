import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();

  const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className={cn('btn-group', className)} {...props}>
      {tabs.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => updateAppearance(value)}
          className={cn('btn btn-sm d-flex align-items-center rounded px-3 py-1', appearance === value ? 'btn-primary' : 'btn-outline-secondary')}
        >
          <Icon className="me-1 h-4 w-4" />
          <span className="small">{label}</span>
        </button>
      ))}
    </div>
  );
}
