import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useAttackTypes } from '@/hooks/useAttacks';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StepAttackSelect() {
  const { selectedModelType, selectedAttackIds, toggleAttack, toggleCategory } =
    useAttackWizardStore();

  const { data: categories, isLoading } = useAttackTypes(selectedModelType);

  if (isLoading) {
    return (
      <div className="animate-[fadeIn_0.3s_ease-out_forwards] max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out_forwards] max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
        수행할 공격 종류를 선택해주세요
      </h3>
      <Card>
        <CardContent className="pt-6 text-foreground">
          {categories?.map((category, catIndex) => {
            const childIds = category.children.map((c) => c.id);
            const allSelected = childIds.every((id) =>
              selectedAttackIds.includes(id)
            );
            const someSelected =
              !allSelected &&
              childIds.some((id) => selectedAttackIds.includes(id));

            return (
              <div
                key={category.id}
                className={catIndex < (categories.length - 1) ? 'mb-8' : ''}
              >
                <label className="flex items-center font-bold text-lg mb-3 cursor-pointer">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={() => toggleCategory(childIds)}
                    className="mr-3 w-5 h-5"
                  />
                  {category.name}
                </label>

                {category.children.length > 1 && (
                  <div className="pl-8 space-y-2 text-base border-l-2 border-border ml-2">
                    {category.children.map((attack) => (
                      <label
                        key={attack.id}
                        className="flex items-center hover:bg-muted p-2 rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedAttackIds.includes(attack.id)}
                          onCheckedChange={() => toggleAttack(attack.id)}
                          className="mr-3 w-4 h-4"
                        />
                        {attack.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {(!categories || categories.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              선택한 모델에 대한 공격 유형이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
