import { EmptyState } from '@/components/shared/EmptyState';

export function DashboardPage() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EmptyState icon="desktop" title="대시보드" description="Phase 6에서 구현 예정입니다." />
    </div>
  );
}
