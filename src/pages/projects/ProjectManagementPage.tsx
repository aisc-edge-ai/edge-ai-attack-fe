import { EmptyState } from '@/components/shared/EmptyState';

export function ProjectManagementPage() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EmptyState icon="cog" title="프로젝트 관리" description="Phase 5에서 구현 예정입니다." />
    </div>
  );
}
