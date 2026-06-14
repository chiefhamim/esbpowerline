import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn('stat group', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
      </CardHeader>
      <CardContent className="pt-1">
        <div className="stat-value text-3xl md:text-[28px]">{value}</div>
        {change && <p className="text-[11px] text-muted-foreground mt-1.5">{change}</p>}
      </CardContent>
    </Card>
  );
}