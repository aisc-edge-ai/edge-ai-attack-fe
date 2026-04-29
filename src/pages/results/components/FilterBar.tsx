import { Button, InputGroup, Menu, MenuItem, MenuDivider, Icon, Popover, Checkbox, Tag, Tooltip } from '@blueprintjs/core';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  modelFilter: string;
  attackFilter: string;
  techniqueFilter: string[];
  search: string;
  modelOptions: FilterOption[];
  attackOptions: FilterOption[];
  techniqueOptions: FilterOption[];
  onModelChange: (value: string) => void;
  onAttackChange: (value: string) => void;
  onTechniqueChange: (values: string[]) => void;
  onSearchChange: (value: string) => void;
}

export function FilterBar({
  modelFilter,
  attackFilter,
  techniqueFilter,
  search,
  modelOptions,
  attackOptions,
  techniqueOptions,
  onModelChange,
  onAttackChange,
  onTechniqueChange,
  onSearchChange,
}: FilterBarProps) {
  const selectedModel = modelOptions.find((o) => o.value === modelFilter) ?? modelOptions[0];
  const selectedAttack = attackOptions.find((o) => o.value === attackFilter) ?? attackOptions[0];
  const isAttackSelected = attackFilter !== 'all';
  const techniques = isAttackSelected ? techniqueOptions : [];

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

  const hasActiveFilter =
    modelFilter !== 'all' ||
    attackFilter !== 'all' ||
    techniqueFilter.length > 0 ||
    search !== '';

  const handleResetFilters = () => {
    onModelChange('all');
    onAttackChange('all');
    onTechniqueChange([]);
    onSearchChange('');
  };

  return (
    <div className="results-filter-bar">
      <div className="filter-group">
        {/* 모델 필터 */}
        <Popover
          content={
            <Menu>
              {modelOptions.map((opt) => (
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
              {attackOptions.map((opt) => (
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
        >
          <Button className="filter-dropdown-btn" rightIcon="caret-down" outlined>
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

        {/* 모든 필터 초기화 */}
        <Tooltip content="모든 필터 초기화" placement="bottom">
          <Button
            className="filter-reset-btn"
            icon="filter-remove"
            outlined
            disabled={!hasActiveFilter}
            onClick={handleResetFilters}
            aria-label="모든 필터 초기화"
          />
        </Tooltip>
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
