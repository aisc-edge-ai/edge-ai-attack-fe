import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useAttackTypes } from '@/hooks/useAttacks';
import { Card, Icon, Tag } from '@blueprintjs/core';
import { cn } from '@/lib/utils';

export function StepAttackSelect() {
  const { selectedModelType, selectedAttackIds, toggleAttack, toggleCategory } =
    useAttackWizardStore();

  const { data: categories, isLoading } = useAttackTypes(selectedModelType);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="bp6-skeleton" style={{ height: 24, width: 256, margin: '0 auto 24px' }} />
        <div className="bp6-skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h5 className="bp6-heading" style={{ marginBottom: 20 }}>수행할 공격 종류를 선택해주세요</h5>

      {categories?.map((category) => {
        const childIds = category.children.map((c) => c.id);
        const allSelected = childIds.every((id) => selectedAttackIds.includes(id));
        const selectedCount = childIds.filter((id) => selectedAttackIds.includes(id)).length;

        return (
          <div key={category.id} className="attack-category">
            {/* 카테고리 헤더 (전체 선택/해제) */}
            <div
              className="attack-category-header"
              onClick={() => toggleCategory(childIds)}
            >
              <div className="attack-category-title">
                <Icon icon="folder-open" size={14} />
                <span>{category.name}</span>
              </div>
              <div className="attack-category-count">
                {selectedCount > 0 && (
                  <Tag minimal round intent="primary">
                    {selectedCount}/{childIds.length}
                  </Tag>
                )}
                <Icon icon={allSelected ? 'tick-circle' : 'circle'} size={16} />
              </div>
            </div>

            {/* 개별 공격 항목 — 선택 가능한 compact 카드 */}
            <div className="attack-items">
              {category.children.map((attack) => {
                const isSelected = selectedAttackIds.includes(attack.id);
                return (
                  <Card
                    key={attack.id}
                    interactive
                    selected={isSelected}
                    compact
                    className={cn('attack-item-card', isSelected && 'selected')}
                    onClick={() => toggleAttack(attack.id)}
                  >
                    <div className="attack-item-content">
                      <Icon
                        icon={isSelected ? 'tick-circle' : 'circle'}
                        size={16}
                        intent={isSelected ? 'primary' : 'none'}
                      />
                      <span className="attack-item-name">{attack.name}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {(!categories || categories.length === 0) && (
        <p className="bp6-text-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
          선택한 모델에 대한 공격 유형이 없습니다.
        </p>
      )}
    </div>
  );
}
