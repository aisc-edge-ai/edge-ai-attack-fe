import type { AttackResult } from '@/types';
import { isImagenetResult } from './isImagenetResult';
import { isMtcResult } from './isMtcResult';
import { isVoiceResult } from './isVoiceResult';

export interface AssessmentPromptParts {
  /** prose 텍스트. {bold} 마커 없는 일반 문자열. */
  kind: 'mtc' | 'voice' | 'imagenet' | 'detection';
  /** detection 변형 시 bold 강조 토큰들 (prose 안에서 강조용). 단일 문장 variant 는 무관. */
  tokens?: {
    model: string;
    dataset: string;
    attack: string;
    successRate: string;
    riskLabel: string;
  };
  /** 줄글 단일 문자열 (mtc / voice 변형). detection 은 컴포넌트에서 inline 조합. */
  longText?: string;
}

/**
 * Vulnerability Assessment 의 prose 텍스트 빌더 — web UI / PDF 모두 공유.
 * MTC / Voice 면 PDF 명세서의 long prose 통째 반환, 그 외엔 inline 조합용 토큰 반환.
 */
export function buildAssessmentPrompt(
  result: AttackResult,
  riskLabel: string,
): AssessmentPromptParts {
  const successRateLabel = result.attackSuccessRate ?? result.successRate;

  if (isVoiceResult(result)) {
    return {
      kind: 'voice',
      longText: `해당 ${result.model}은(는) ${result.dataset ?? '데이터셋'} 환경에서 수행한 합성 음성 입력 공격(딥보이스) 점검 결과, 공격 성공률이 ${successRateLabel}로 나타나 ${riskLabel} 수준의 취약성을 보였다. 이는 공격자가 딥보이스 기반 합성 음성을 입력할 경우, 인식 모델이 비정상적으로 동작하거나 오인식할 가능성이 있음을 의미한다.`,
    };
  }

  if (isMtcResult(result)) {
    return {
      kind: 'mtc',
      longText: `해당 모델군에 대해 수행한 Model Type Classification 에서 공격 성공률이 ${successRateLabel} 로 나타나 ${riskLabel} 수준의 취약성을 보였다. 이는 공격자가 대상 모델의 출력값 또는 출력 분포를 분석함으로써, 사전에 정의된 N개의 후보 모델 중 해당 모델이 어떤 유형에 속하는지 식별할 가능성이 있음을 의미한다. 이와 같이 유출된 모델 구조 정보는 이후 모델 복제, 표적형 적대적 공격, 우회 공격 등 추가적인 공격의 기초 정보로 악용될 수 있다.`,
    };
  }

  if (isImagenetResult(result)) {
    return {
      kind: 'imagenet',
      longText: `해당 ${result.model}은(는) ${result.dataset ?? 'ImageNet 데이터셋'}에 대해 수행한 적대적 공격(${result.attack}) 점검 결과, 공격 성공률이 ${successRateLabel}로 나타나 ${riskLabel} 수준의 취약성을 보였다. Contour 계열 공격은 이미지의 윤곽선(contour) 영역에만 perturbation을 적용하여 시각적 차이를 최소화하면서도 분류 결과를 변경할 수 있음을 보여준다.`,
    };
  }

  return {
    kind: 'detection',
    tokens: {
      model: result.model,
      dataset: result.dataset ?? '테스트 데이터셋',
      attack: result.attack,
      successRate: successRateLabel,
      riskLabel,
    },
  };
}
