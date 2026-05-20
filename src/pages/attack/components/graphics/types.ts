export type AttackGraphicState = 'idle' | 'preview' | 'selected' | 'running';

export interface AttackGraphicProps {
  /** preview = hover, selected = clicked, running = 공격 진행 중 */
  state: AttackGraphicState;
  /** 선택된 공격 ID (modelType 별 SVG 가 분기) */
  attackId: string | null;
  /** Stage 02 세부 모델의 헤더 chip 라벨 (예: "YOLOv5"). CCTV scene 전용. 선택값 없으면 undefined */
  modelDisplayLabel?: string;
  /** Stage 04 데이터셋 chip 텍스트 (예: "snack-v3 · 320 MB"). CCTV scene 전용. hover/select 없으면 undefined */
  datasetLabel?: string;
}
