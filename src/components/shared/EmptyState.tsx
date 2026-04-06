import { Target } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted p-12">
      {icon || <Target size={48} className="mb-4 text-muted-foreground/50" />}
      <p className="text-lg font-medium text-foreground mb-2">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
