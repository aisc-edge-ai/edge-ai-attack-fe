import { Button, InputGroup, Menu, MenuItem, MenuDivider, Icon, Popover, Checkbox, Tag } from '@blueprintjs/core';

interface FilterBarProps {
  modelFilter: string;
  attackFilter: string;
  techniqueFilter: string[];
  search: string;
  onModelChange: (value: string) => void;
  onAttackChange: (value: string) => void;
  onTechniqueChange: (values: string[]) => void;
  onSearchChange: (value: string) => void;
}

const MODEL_OPTIONS = [
  { value: 'all', label: '모든 모델' },
  { value: 'YOLOv8', label: '객체 탐지 (CCTV)' },
  { value: 'Whisper', label: '음성 인식 (비서)' },
  { value: 'ResNet50', label: '이미지 분류 (자율주행)' },
];

const ATTACK_OPTIONS = [
  { value: 'all', label: '모든 공격 기법' },
  { value: 'Patch-Hiding', label: '적대적 패치' },
  { value: 'FGSM', label: 'FGSM / PGD' },
  { value: '딥보이스 우회', label: '음성 우회' },
];

const TECHNIQUE_MAP: Record<string, { value: string; label: string }[]> = {
  'Patch-Hiding': [
    { value: 'Hiding', label: 'Hiding' },
    { value: 'Creating', label: 'Creating' },
    { value: 'Altering', label: 'Altering' },
  ],
  'FGSM': [
    { value: 'FGSM', label: 'FGSM' },
    { value: 'BIM', label: 'BIM' },
    { value: 'PGD', label: 'PGD' },
  ],
  '딥보이스 우회': [
    { value: '딥보이스', label: '딥보이스 우회' },
  ],
};

export function FilterBar({
  modelFilter,
  attackFilter,
  techniqueFilter,
  search,
  onModelChange,
  onAttackChange,
  onTechniqueChange,
  onSearchChange,
}: FilterBarProps) {
  const selectedModel = MODEL_OPTIONS.find((o) => o.value === modelFilter);
  const selectedAttack = ATTACK_OPTIONS.find((o) => o.value === attackFilter);
  const isModelSelected = modelFilter !== 'all';
  const isAttackSelected = attackFilter !== 'all';
  const techniques = isAttackSelected ? (TECHNIQUE_MAP[attackFilter] || []) : [];

  const toggleTechnique = (value: string) => {
    if (techniqueFilter.includes(value)) {
      onTechniqueChange(techniqueFilter.filter((t) => t !== value));
    } else {
      onTechniqueChange([...techniqueFilter, value]);
    }
  };

  const techniqueLabel = techniqueFilter.length === 0
    ? '모든 세부 기법'
    : techniqueFilter.length === 1
      ? techniqueFilter[0]
      : `${techniqueFilter[0]} 외 ${techniqueFilter.length - 1}개`;

  return (
    <div className="results-filter-bar">
      <div className="filter-group">
        {/* 모델 필터 */}
        <Popover
          content={
            <Menu>
              {MODEL_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  text={opt.label}
                  icon={modelFilter === opt.value ? 'tick' : 'blank'}
                  onClick={() => {
                    onModelChange(opt.value);
                    if (opt.value === 'all') {
                      onAttackChange('all');
                      onTechniqueChange([]);
                    }
                  }}
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

        {/* 공격 기법 필터 */}
        <Popover
          content={
            <Menu>
              {ATTACK_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  text={opt.label}
                  icon={attackFilter === opt.value ? 'tick' : 'blank'}
                  onClick={() => {
                    onAttackChange(opt.value);
                    onTechniqueChange([]);
                  }}
                />
              ))}
            </Menu>
          }
          placement="bottom-start"
          minimal
          disabled={!isModelSelected}
        >
          <Button className="filter-dropdown-btn" rightIcon="caret-down" outlined disabled={!isModelSelected}>
            <Icon icon="shield" size={14} />
            <span className="filter-dropdown-label">공격:</span>
            <span className="filter-dropdown-value">{selectedAttack?.label}</span>
          </Button>
        </Popover>

        {/* 세부 기법 다중 선택 필터 */}
        <Popover
          content={
            <Menu>
              <MenuItem
                text="전체 선택/해제"
                icon={techniqueFilter.length === techniques.length && techniques.length > 0 ? 'tick' : 'blank'}
                onClick={() => {
                  if (techniqueFilter.length === techniques.length) {
                    onTechniqueChange([]);
                  } else {
                    onTechniqueChange(techniques.map((t) => t.value));
                  }
                }}
              />
              <MenuDivider />
              {techniques.map((tech) => (
                <MenuItem
                  key={tech.value}
                  text={
                    <Checkbox
                      checked={techniqueFilter.includes(tech.value)}
                      label={tech.label}
                      onChange={() => toggleTechnique(tech.value)}
                      style={{ marginBottom: 0 }}
                    />
                  }
                  shouldDismissPopover={false}
                />
              ))}
            </Menu>
          }
          placement="bottom-start"
          minimal
          disabled={!isAttackSelected || techniques.length === 0}
        >
          <Button
            className="filter-dropdown-btn"
            rightIcon="caret-down"
            outlined
            disabled={!isAttackSelected || techniques.length === 0}
          >
            <Icon icon="filter" size={14} />
            <span className="filter-dropdown-label">기법:</span>
            <span className="filter-dropdown-value">{techniqueLabel}</span>
            {techniqueFilter.length > 0 && (
              <Tag minimal round intent="primary">{techniqueFilter.length}</Tag>
            )}
          </Button>
        </Popover>
      </div>

      <InputGroup
        leftIcon="search"
        placeholder="로그 ID 또는 모델명 검색"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 280 }}
      />
    </div>
  );
}
