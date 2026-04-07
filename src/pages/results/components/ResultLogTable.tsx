import { Card, HTMLTable, Button, Intent } from '@blueprintjs/core';
import { RiskBadge } from '@/components/shared/RiskBadge';
import type { AttackResult } from '@/types';

interface ResultLogTableProps {
  results: AttackResult[];
  isLoading: boolean;
  onViewAnalysis: (result: AttackResult) => void;
}

export function ResultLogTable({ results, isLoading, onViewAnalysis }: ResultLogTableProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h5 className="bp6-heading" style={{ margin: 0 }}>상세 공격 결과 로그</h5>
        <Button icon="download" text="CSV 다운로드" minimal small />
      </div>

      <HTMLTable bordered striped interactive className="bp6-html-table-compact" style={{ width: '100%', fontSize: 12 }}>
        <thead>
          <tr>
            <th>로그 ID</th>
            <th>일시</th>
            <th>타겟 모델</th>
            <th>공격 종류</th>
            <th>공격 성공률</th>
            <th>위험도</th>
            <th style={{ textAlign: 'center' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j}><span className="bp6-skeleton" style={{ display: 'block', height: 16 }} /></td>
                ))}
              </tr>
            ))
          ) : results.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: 32 }} className="bp6-text-muted">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            results.map((result) => (
              <tr key={result.id}>
                <td><code className="bp6-code">{result.id}</code></td>
                <td className="bp6-text-muted">{result.date}</td>
                <td>
                  <strong>{result.model}</strong>
                  <br />
                  <span className="bp6-text-muted" style={{ fontSize: 12 }}>{result.modelType}</span>
                </td>
                <td>{result.attack}</td>
                <td><strong>{result.successRate}</strong></td>
                <td><RiskBadge risk={result.risk} /></td>
                <td style={{ textAlign: 'center' }}>
                  <Button
                    text="상세 분석"
                    small
                    intent={Intent.PRIMARY}
                    minimal
                    onClick={() => onViewAnalysis(result)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </HTMLTable>
    </Card>
  );
}
