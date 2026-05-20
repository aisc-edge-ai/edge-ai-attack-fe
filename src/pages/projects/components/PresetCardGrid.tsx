import type { Preset } from '@/types';
import { PresetCard } from './PresetCard';

interface PresetCardGridProps {
  presets: Preset[];
  onEdit: (preset: Preset) => void;
  onDelete: (id: string) => void;
}

export function PresetCardGrid({ presets, onEdit, onDelete }: PresetCardGridProps) {
  return (
    <div className="preset-card-grid">
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
