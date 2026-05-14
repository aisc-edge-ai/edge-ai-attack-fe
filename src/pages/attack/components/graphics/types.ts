export type AttackGraphicState = 'idle' | 'preview' | 'selected' | 'running';

export interface AttackGraphicProps {
  /** preview = hover, selected = clicked, running = 공격 진행 중 */
  state: AttackGraphicState;
  /** 선택된 공격 ID (modelType 별 SVG 가 분기) */
  attackId: string | null;
}
