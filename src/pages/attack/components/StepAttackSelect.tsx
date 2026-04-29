import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useAttackTypes } from '@/hooks/useAttacks';
import { Card, Icon, Tag } from '@blueprintjs/core';
import { cn } from '@/lib/utils';
import { isAttackTypeSupported } from '@/lib/constants';

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
      {categories?.map((category) => {
        const childIds = category.children.map((c) => c.id);
        const supportedChildIds = childIds.filter(isAttackTypeSupported);
        const hasSupportedChildren = supportedChildIds.length > 0;
        const allSelected =
          hasSupportedChildren &&
          supportedChildIds.every((id) => selectedAttackIds.includes(id));
        const selectedCount = supportedChildIds.filter((id) =>
          selectedAttackIds.includes(id)
        ).length;

        return (
          <div key={category.id} className="attack-category">
            {/* 카테고리 헤더 (전체 선택/해제) */}
            <div
              className={cn('attack-category-header', !hasSupportedChildren && 'disabled')}
              onClick={() => {
                if (!hasSupportedChildren) return;
                toggleCategory(supportedChildIds);
              }}
              aria-disabled={!hasSupportedChildren}
            >
              <div className="attack-category-title">
                <Icon icon="folder-open" size={14} />
                <span>{category.name}</span>
                {!hasSupportedChildren && (
                  <Tag intent="warning" minimal>
                    준비 중
                  </Tag>
                )}
              </div>
              <div className="attack-category-count">
                {selectedCount > 0 && (
                  <Tag minimal round intent="primary">
                    {selectedCount}/{supportedChildIds.length}
                  </Tag>
                )}
                <Icon icon={allSelected ? 'tick-circle' : 'circle'} size={16} />
              </div>
            </div>

            {/* 개별 공격 항목 — 선택 가능한 compact 카드 */}
            <div className="attack-items">
              {category.children.map((attack) => {
                const isSelected = selectedAttackIds.includes(attack.id);
                const isSupported = isAttackTypeSupported(attack.id);
                return (
                  <Card
                    key={attack.id}
                    interactive={isSupported}
                    selected={isSelected}
                    compact
                    className={cn(
                      'attack-item-card',
                      isSelected && 'selected',
                      !isSupported && 'disabled'
                    )}
                    onClick={() => {
                      if (!isSupported) return;
                      toggleAttack(attack.id);
                    }}
                    aria-disabled={!isSupported}
                  >
                    <div className="attack-item-content">
                      <Icon
                        icon={isSelected ? 'tick-circle' : 'circle'}
                        size={16}
                        intent={isSelected ? 'primary' : 'none'}
                      />
                      <span className="attack-item-name">{attack.name}</span>
                      {!isSupported && (
                        <Tag intent="warning" minimal>
                          준비 중
                        </Tag>
                      )}
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
