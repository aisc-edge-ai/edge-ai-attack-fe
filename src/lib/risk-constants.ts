/**
 * 위험도 판정 관련 공유 상수
 *
 * ResultAnalysisTab(웹 UI)과 ReportPdfDocument(PDF 출력) 양쪽에서
 * 동일한 데이터를 참조하므로 단일 원천(single source of truth)으로 관리한다.
 */
import type { RiskLevel } from '@/types';

/* ---- 위험도 라벨 ---- */
export const RISK_LABELS: Record<RiskLevel, string> = {
  vulnerable: '취약 (Vulnerable)',
  warning: '경고 (Warning)',
  safe: '안전 (Safe)',
};

/* ---- 등급 기준 및 해석 ---- */
export const GRADE_CRITERIA: Array<{
  risk: RiskLevel;
  label: string;
  description: string;
}> = [
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

/* ---- 보안 권고사항 ---- */
export const RECOMMENDATIONS: Array<{
  num: string;
  title: string;
  description: string;
}> = [
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
