import { NonIdealState, Icon, type IconName } from '@blueprintjs/core';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactElement;
}

export function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  return (
    <NonIdealState
      icon={<Icon icon={icon} size={48} />}
      title={title}
      description={description}
      action={action}
    />
  );
}
