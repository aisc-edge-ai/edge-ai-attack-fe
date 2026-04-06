import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAttackProgress } from '@/hooks/useAttackProgress';
import { useSaveAttackData } from '@/hooks/useDatasets';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { ShieldAlert, CheckCircle, Save, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AttackProgressModalProps {
  open: boolean;
  onClose: () => void;
  attackId: string | null;
}

export function AttackProgressModal({
  open,
  onClose,
  attackId,
}: AttackProgressModalProps) {
  const navigate = useNavigate();
  const reset = useAttackWizardStore((s) => s.reset);
  const { progress } = useAttackProgress(open ? attackId : null);
  const saveAttackData = useSaveAttackData();
  const [datasetName, setDatasetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const progressPercent = progress
    ? Math.round((progress.progress / progress.total) * 100)
    : 0;

  const handleSave = async () => {
    if (!attackId || !datasetName.trim()) return;
    try {
      await saveAttackData.mutateAsync({
        attackId,
        name: datasetName.trim(),
      });
      toast.success('공격 데이터가 저장되었습니다.');
      setShowSaveForm(false);
    } catch {
      toast.error('데이터 저장에 실패했습니다.');
    }
  };

  const handleViewResults = () => {
    onClose();
    if (attackId) {
      navigate(`/results/${attackId}`);
    }
  };

  const handleNewAttack = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (!isCompleted && !isFailed) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {isCompleted ? (
              <>
                <CheckCircle size={22} className="mr-2 text-emerald-500" />
                모의 공격 완료
              </>
            ) : isFailed ? (
              <>
                <ShieldAlert size={22} className="mr-2 text-destructive" />
                공격 실행 실패
              </>
            ) : (
              <>
                <ShieldAlert size={22} className="mr-2 text-primary animate-pulse" />
                모의 공격 진행 중...
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompleted
              ? '모의 공격이 성공적으로 완료되었습니다.'
              : isFailed
                ? '공격 실행 중 오류가 발생했습니다.'
                : '공격 데이터를 생성하고 모의 공격을 수행하고 있습니다.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 프로그레스 바 */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground font-medium">
                {progress?.currentStep || '준비 중...'}
              </span>
              <span className="font-bold text-foreground">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          {/* 부가 정보 */}
          {progress && !isCompleted && !isFailed && (
            <div className="flex justify-between text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <span>
                진행률: {progress.progress}/{progress.total}
              </span>
              {progress.eta !== undefined && progress.eta > 0 && (
                <span>예상 잔여: {progress.eta}초</span>
              )}
            </div>
          )}

          {/* 완료 시 액션 버튼 */}
          {isCompleted && (
            <div className="space-y-3 pt-2">
              {!showSaveForm ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowSaveForm(true)}
                >
                  <Save size={16} className="mr-2" />
                  공격 데이터 저장
                </Button>
              ) : (
                <div className="flex items-center space-x-2 animate-[fadeIn_0.3s_ease-out_forwards]">
                  <Input
                    placeholder="데이터셋 이름 입력"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSave}
                    disabled={!datasetName.trim() || saveAttackData.isPending}
                    size="sm"
                  >
                    {saveAttackData.isPending ? '저장 중...' : '저장'}
                  </Button>
                </div>
              )}

              <Button className="w-full" onClick={handleViewResults}>
                <ArrowRight size={16} className="mr-2" />
                결과 분석 보기
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={handleNewAttack}
              >
                <RotateCcw size={16} className="mr-2" />
                새 공격 시작
              </Button>
            </div>
          )}

          {isFailed && (
            <div className="space-y-3 pt-2">
              <Button variant="outline" className="w-full" onClick={handleNewAttack}>
                <RotateCcw size={16} className="mr-2" />
                다시 시도
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
