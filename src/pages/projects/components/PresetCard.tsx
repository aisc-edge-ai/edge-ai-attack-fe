import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tag, Tooltip, Alert, Intent, Icon } from '@blueprintjs/core';
import type { Preset } from '@/types';
import { ATTACK_TYPE_LABELS } from '@/lib/constants';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import type { ModelType } from '@/types';

interface PresetCardProps {
  preset: Preset;
  onEdit: (preset: Preset) => void;
  onDelete: (id: string) => void;
}

const MODEL_TYPE_INTENT: Record<string, Intent> = {
  cctv: Intent.PRIMARY,
  voice: Intent.SUCCESS,
  classification: Intent.WARNING,
};

const MODEL_TYPE_LABEL: Record<string, string> = {
  cctv: 'CCTV',
  voice: 'Voice',
  classification: 'Classification',
};

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function PresetCard({ preset, onEdit, onDelete }: PresetCardProps) {
  const navigate = useNavigate();
  const wizardStore = useAttackWizardStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUsePreset = () => {
    wizardStore.reset();
    wizardStore.setModelType(preset.modelType as ModelType);
    navigate('/attack');
  };

  return (
    <>
      <div className="preset-card">
        <div className="preset-card-header">
          <h3 className="preset-card-name">{preset.name}</h3>
          <Tag
            intent={MODEL_TYPE_INTENT[preset.modelType] ?? Intent.NONE}
            minimal
          >
            {MODEL_TYPE_LABEL[preset.modelType] ?? preset.modelType}
          </Tag>
        </div>

        <div className="preset-card-body">
          {preset.description && (
            <p className="preset-card-desc">{preset.description}</p>
          )}

          <div className="preset-card-attacks">
            {preset.attackTypeIds.map((id) => (
              <Tag key={id} minimal round>
                {ATTACK_TYPE_LABELS[id] ?? id}
              </Tag>
            ))}
          </div>

          {preset.datasetNames.length > 0 && (
            <div className="preset-card-meta">
              <Icon icon="folder-open" size={12} />
              <span>{preset.datasetNames.join(', ')}</span>
            </div>
          )}
          {preset.dataSource === 'generate' && (
            <div className="preset-card-meta">
              <Icon icon="automatic-updates" size={12} />
              <span>데이터 자동 생성</span>
            </div>
          )}
        </div>

        <div className="preset-card-footer">
          <span className="preset-card-date">
            {formatDate(preset.updatedAt)}
          </span>
          <div className="preset-card-actions">
            <Tooltip content="수정" placement="top">
              <Button
                icon="edit"
                minimal
                small
                onClick={() => onEdit(preset)}
              />
            </Tooltip>
            <Tooltip content="삭제" placement="top">
              <Button
                icon="trash"
                intent={Intent.DANGER}
                minimal
                small
                onClick={() => setDeleteOpen(true)}
              />
            </Tooltip>
            <Tooltip content="이 프리셋으로 공격 실행" placement="top">
              <Button
                icon="play"
                intent={Intent.PRIMARY}
                small
                outlined
                text="사용"
                onClick={handleUsePreset}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <Alert
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          onDelete(preset.id);
          setDeleteOpen(false);
        }}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="삭제"
        cancelButtonText="취소"
      >
        <p>
          <strong>{preset.name}</strong> 프리셋을 삭제하시겠습니까?
        </p>
      </Alert>
    </>
  );
}
