/**
 * 위험도 판정 관련 공유 상수
 *
 * ResultAnalysisTab(웹 UI)과 ReportPdfDocument(PDF 출력) 양쪽에서
 * 동일한 데이터를 참조하므로 단일 원천(single source of truth)으로 관리한다.
 *
 * 공격 유형(modelType) 별로 등급 해석 / 권고가 다를 때는 `getGradeCriteria()`
 * / `getRecommendations()` 헬퍼로 lookup. 기본값은 객체 탐지(CCTV) 기준.
 */
import type { RiskLevel } from '@/types';

/* ---- 위험도 라벨 ---- */
export const RISK_LABELS: Record<RiskLevel, string> = {
  vulnerable: '취약 (Vulnerable)',
  warning: '경고 (Warning)',
  safe: '안전 (Safe)',
};

export interface GradeCriterion {
  risk: RiskLevel;
  label: string;
  description: string;
}

export interface Recommendation {
  num: string;
  title: string;
  description: string;
}

/* ---- 등급 기준 및 해석 (객체 탐지 기본) ---- */
export const GRADE_CRITERIA: GradeCriterion[] = [
  {
    risk: 'safe',
    label: '안전 (Safe)',
    description:
      '공격 성공률이 낮으며, 모델이 입력 교란에도 불구하고 안정적으로 객체를 탐지함. 실제 환경에서 악의적인 입력에 대한 대응력이 충분한 수준으로 판단됨.',
  },
  {
    risk: 'warning',
    label: '경고 (Warning)',
    description:
      '일부 공격 조건에서 탐지 성능 저하가 확인됨. 특정 상황(패치 위치, 크기 등)에 따라 취약점이 발생할 수 있어 추가적인 방어 전략 적용이 필요함.',
  },
  {
    risk: 'vulnerable',
    label: '취약 (Vulnerable)',
    description:
      '공격 성공률이 높으며, 제한된 조건에서도 객체 탐지가 쉽게 무력화됨. 실제 서비스 환경에서 악용 가능성이 높아 즉각적인 보완 조치가 요구됨.',
  },
];

/* ---- 보안 권고사항 (객체 탐지 기본) ---- */
export const RECOMMENDATIONS: Recommendation[] = [
  {
    num: '01',
    title: '적대적 학습 (Adversarial Training)',
    description:
      'Patch 공격 데이터를 학습 데이터에 포함하여 모델 재학습 수행. 다양한 위치·크기·패턴의 공격을 반영해 모델의 강건성(robustness) 향상.',
  },
  {
    num: '02',
    title: '입력 데이터 전처리 적용',
    description:
      'Spatial Smoothing, Gaussian Blur, JPEG 압축 등 노이즈 제거 기법 적용. 공격 패치의 고주파 성분을 완화하여 공격 효과 감소.',
  },
  {
    num: '03',
    title: '이상 패턴 탐지 또는 입력 무결성 검증',
    description:
      '입력 이미지 내 비정상적인 국소 패턴이나 패치 삽입 여부를 탐지하는 절차를 추가함. 공격 의심 입력을 사전 차단하거나 별도 후처리하도록 구성하는 것이 바람직함.',
  },
];

/* ---- MTC (Model Type Classification) 전용 등급 / 권고 (PDF 명세 그대로) ---- */
export const MTC_GRADE_CRITERIA: GradeCriterion[] = [
  {
    risk: 'safe',
    label: '안전 (Safe)',
    description:
      '공격 성공률이 낮으며, 모델의 출력값만으로는 N개의 후보 모델 중 대상 모델의 타입을 유의미하게 식별하기 어려운 수준임. 실제 환경에서도 출력 정보가 직접적인 모델 구조 추론으로 이어질 가능성이 낮아 비교적 안전한 수준으로 판단된다.',
  },
  {
    risk: 'warning',
    label: '경고 (Warning)',
    description:
      '일부 조건에서 모델 출력값을 기반으로 후보 모델군 내에서 대상 모델 타입 추론이 가능한 것으로 확인됨. 출력되는 클래스 수, 확률 분포의 형태, 응답의 일관성 등에 따라 모델 식별 가능성이 높아질 수 있으므로 추가적인 보호 조치가 필요하다.',
  },
  {
    risk: 'vulnerable',
    label: '취약 (Vulnerable)',
    description:
      '공격 성공률이 높으며, 제한된 출력 정보만으로도 N개의 후보 모델 중 대상 모델의 타입 또는 계열이 비교적 정확하게 식별될 수 있음. 실제 서비스 환경에서 모델 구조 노출, 모방 모델 생성, 맞춤형 공격 설계 등에 악용될 가능성이 높아 즉각적인 보완 조치가 요구된다.',
  },
];

export const MTC_RECOMMENDATIONS: Recommendation[] = [
  {
    num: '01',
    title: '출력 정보 최소화 및 응답 제한',
    description:
      '모델 응답 시 상위 N개 출력값이나 상세 확률 분포를 그대로 제공하지 않도록 제한할 필요가 있음. 필요 최소한의 결과만 반환하도록 구성하여, 공격자가 출력 분포를 분석해 모델 특성을 추론할 가능성을 낮추는 것이 바람직함. 확률값 대신 최종 예측 클래스만 제공하거나, confidence score 의 정밀도를 낮추는 방안도 고려할 수 있음.',
  },
  {
    num: '02',
    title: '출력값 후처리 및 노출 완화',
    description:
      '출력 확률값에 대해 반올림, clipping, temperature scaling, noise 추가 등의 후처리를 적용하여 모델 고유의 분포 특성이 직접 노출되지 않도록 할 필요가 있음. 모델 타입 추론에 활용될 수 있는 미세한 출력 패턴을 완화함으로써 공격 효과를 감소시킬 수 있음.',
  },
  {
    num: '03',
    title: '질의 패턴 모니터링 및 이상 요청 탐지',
    description:
      '동일하거나 유사한 입력에 대해 반복적으로 질의하거나, 출력 분포 수집을 목적으로 하는 비정상 요청 패턴을 탐지하는 절차를 추가할 필요가 있음. 공격이 의심되는 요청에 대해서는 응답 제한, 속도 제한, 추가 인증, 로그 분석 등의 대응 절차를 적용하는 것이 바람직함.',
  },
];

function isMtc(modelType: string | undefined): boolean {
  if (!modelType) return false;
  return modelType === 'classification' || modelType.startsWith('이미지 분류');
}

/** modelType 에 맞는 등급 해석을 반환. 미지정/매칭 안 됨 → 객체 탐지 기본. */
export function getGradeCriteria(modelType: string | undefined): GradeCriterion[] {
  return isMtc(modelType) ? MTC_GRADE_CRITERIA : GRADE_CRITERIA;
}

/** modelType 에 맞는 권고사항을 반환. 미지정/매칭 안 됨 → 객체 탐지 기본. */
export function getRecommendations(modelType: string | undefined): Recommendation[] {
  return isMtc(modelType) ? MTC_RECOMMENDATIONS : RECOMMENDATIONS;
}
