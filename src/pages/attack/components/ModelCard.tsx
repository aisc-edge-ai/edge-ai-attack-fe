import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModelCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}

export function ModelCard({
  icon,
  title,
  subtitle,
  selected,
  onClick,
}: ModelCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center p-8 border-2 cursor-pointer transition w-64 text-center',
        selected
          ? 'border-primary bg-primary/10 shadow-md transform -translate-y-1'
          : 'hover:border-primary/50 hover:shadow-sm'
      )}
    >
      <div
        className={cn(
          'mb-4 transition',
          selected ? 'text-primary scale-110' : 'text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <div className="font-bold text-lg mb-1 text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </Card>
  );
}
