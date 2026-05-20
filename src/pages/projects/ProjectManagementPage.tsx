import { useState, useMemo } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProjectHeader } from './components/ProjectHeader';
import { PresetFilterBar } from './components/PresetFilterBar';
import { PresetCardGrid } from './components/PresetCardGrid';
import { PresetDialog } from './components/PresetDialog';
import { usePresets, useDeletePreset } from '@/hooks/usePresets';
import type { Preset } from '@/types';

export function ProjectManagementPage() {
  const { data: presets = [], isLoading } = usePresets();
  const deleteMutation = useDeletePreset();

  const [search, setSearch] = useState('');
  const [modelTypeFilter, setModelTypeFilter] = useState('all');
  const [attackFilter, setAttackFilter] = useState('all');
  const [dialogMode, setDialogMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const filteredPresets = useMemo(() => {
    let result = presets;

    if (modelTypeFilter !== 'all') {
      result = result.filter((p) => p.modelType === modelTypeFilter);
    }

    if (attackFilter !== 'all') {
      result = result.filter((p) => p.attackTypeIds.includes(attackFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q) ||
          p.datasetNames.some((n) => n.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [presets, modelTypeFilter, attackFilter, search]);

  const handleCreate = () => {
    setEditingPreset(null);
    setDialogMode('create');
  };

  const handleEdit = (preset: Preset) => {
    setEditingPreset(preset);
    setDialogMode('edit');
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleResetFilters = () => {
    setSearch('');
    setModelTypeFilter('all');
    setAttackFilter('all');
  };

  if (isLoading) {
    return (
      <div className="projects-page-layout">
        <div className="projects-header">
          <div className="projects-header-text">
            <h2 className="projects-header-title">프로젝트 관리</h2>
            <p className="projects-header-desc">불러오는 중...</p>
          </div>
        </div>
        <section className="results-section-card">
          <header className="results-section-header">프로젝트 개요</header>
          <div className="prominent-card">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="prominent-item">
                <div className="prominent-label bp6-skeleton" style={{ width: 80 }}>&nbsp;</div>
                <div className="prominent-value bp6-skeleton" style={{ width: 60 }}>&nbsp;</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="projects-page-layout">
      <ProjectHeader
        presetCount={presets.length}
        onCreateClick={handleCreate}
      />

      <PresetFilterBar
        search={search}
        modelTypeFilter={modelTypeFilter}
        attackFilter={attackFilter}
        onSearchChange={setSearch}
        onModelTypeChange={setModelTypeFilter}
        onAttackChange={setAttackFilter}
        onReset={handleResetFilters}
      />

      {filteredPresets.length === 0 ? (
        <EmptyState
          icon="cog"
          title="프리셋 없음"
          description={
            presets.length === 0
              ? '아직 등록된 프리셋이 없습니다. 새 프리셋을 만들어 보세요.'
              : '필터 조건에 맞는 프리셋이 없습니다.'
          }
          action={
            presets.length === 0 ? (
              <Button
                intent={Intent.PRIMARY}
                icon="plus"
                text="새 프리셋 만들기"
                onClick={handleCreate}
              />
            ) : undefined
          }
        />
      ) : (
        <PresetCardGrid
          presets={filteredPresets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PresetDialog
        mode={dialogMode}
        preset={editingPreset}
        onClose={() => setDialogMode('closed')}
      />
    </div>
  );
}
