import { Button, InputGroup, Menu, MenuItem, Icon, Popover, Tooltip } from '@blueprintjs/core';
import { SUPPORTED_MODEL_TYPES, MODEL_TYPE_LABELS, ATTACK_TYPE_LABELS, SUPPORTED_ATTACK_TYPE_IDS } from '@/lib/constants';

interface PresetFilterBarProps {
  search: string;
  modelTypeFilter: string;
  attackFilter: string;
  onSearchChange: (value: string) => void;
  onModelTypeChange: (value: string) => void;
  onAttackChange: (value: string) => void;
  onReset: () => void;
}

const modelTypeOptions = [
  { value: 'all', label: '전체 모델' },
  ...SUPPORTED_MODEL_TYPES.map((mt) => ({
    value: mt,
    label: MODEL_TYPE_LABELS[mt] ?? mt,
  })),
];

const attackOptions = [
  { value: 'all', label: '전체 공격' },
  ...SUPPORTED_ATTACK_TYPE_IDS.map((id) => ({
    value: id,
    label: ATTACK_TYPE_LABELS[id] ?? id,
  })),
];

export function PresetFilterBar({
  search,
  modelTypeFilter,
  attackFilter,
  onSearchChange,
  onModelTypeChange,
  onAttackChange,
  onReset,
}: PresetFilterBarProps) {
  const selectedModel = modelTypeOptions.find((o) => o.value === modelTypeFilter) ?? modelTypeOptions[0];
  const selectedAttack = attackOptions.find((o) => o.value === attackFilter) ?? attackOptions[0];

  const hasActiveFilter =
    modelTypeFilter !== 'all' || attackFilter !== 'all' || search !== '';

  return (
    <div className="results-filter-bar">
      <div className="filter-group">
        <Popover
          content={
            <Menu>
              {modelTypeOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  text={opt.label}
                  icon={modelTypeFilter === opt.value ? 'tick' : 'blank'}
                  onClick={() => onModelTypeChange(opt.value)}
                />
              ))}
            </Menu>
          }
          placement="bottom-start"
          minimal
        >
          <Button className="filter-dropdown-btn" rightIcon="caret-down" outlined>
            <Icon icon="desktop" size={14} />
            <span className="filter-dropdown-label">모델:</span>
            <span className="filter-dropdown-value">{selectedModel?.label}</span>
          </Button>
        </Popover>

        <Popover
          content={
            <Menu>
              {attackOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  text={opt.label}
                  icon={attackFilter === opt.value ? 'tick' : 'blank'}
                  onClick={() => onAttackChange(opt.value)}
                />
              ))}
            </Menu>
          }
          placement="bottom-start"
          minimal
        >
          <Button className="filter-dropdown-btn" rightIcon="caret-down" outlined>
            <Icon icon="shield" size={14} />
            <span className="filter-dropdown-label">공격:</span>
            <span className="filter-dropdown-value">{selectedAttack?.label}</span>
          </Button>
        </Popover>

        <Tooltip content="모든 필터 초기화" placement="bottom">
          <Button
            className="filter-reset-btn"
            icon="filter-remove"
            outlined
            disabled={!hasActiveFilter}
            onClick={onReset}
            aria-label="모든 필터 초기화"
          />
        </Tooltip>
      </div>

      <InputGroup
        leftIcon="search"
        placeholder="프리셋명 / 모델명 / 데이터셋 검색"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 280 }}
      />
    </div>
  );
}
