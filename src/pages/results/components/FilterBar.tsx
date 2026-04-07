import { Card, HTMLSelect, InputGroup } from '@blueprintjs/core';

interface FilterBarProps {
  modelFilter: string;
  attackFilter: string;
  search: string;
  onModelChange: (value: string) => void;
  onAttackChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function FilterBar({
  modelFilter,
  attackFilter,
  search,
  onModelChange,
  onAttackChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <Card className="filter-bar">
      <div className="filter-group">
        <HTMLSelect value={modelFilter} onChange={(e) => onModelChange(e.target.value)}>
          <option value="all">모든 모델</option>
          <option value="YOLOv8">객체 탐지 (CCTV)</option>
          <option value="Whisper">음성 인식 (비서)</option>
          <option value="ResNet50">이미지 분류 (자율주행)</option>
        </HTMLSelect>

        <HTMLSelect value={attackFilter} onChange={(e) => onAttackChange(e.target.value)}>
          <option value="all">모든 공격 기법</option>
          <option value="Patch-Hiding">적대적 패치</option>
          <option value="FGSM">FGSM / PGD</option>
          <option value="딥보이스 우회">음성 우회</option>
        </HTMLSelect>
      </div>

      <InputGroup
        leftIcon="search"
        placeholder="로그 ID 또는 모델명 검색"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 280 }}
      />
    </Card>
  );
}
