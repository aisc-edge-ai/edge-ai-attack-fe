import { Card, Elevation } from '@blueprintjs/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// TODO: API 연동 시 GET /results/summary 또는 집계 API에서 동적 데이터로 교체
const data = [
  { name: '패치 (Hiding)', rate: 82 },
  { name: 'PGD', rate: 65 },
  { name: '딥보이스 우회', rate: 45 },
  { name: 'FGSM', rate: 22 },
];

export function SuccessRateChart() {
  return (
    <Card elevation={Elevation.ONE}>
      <h5 className="bp6-heading" style={{ marginBottom: 16 }}>공격 기법별 성공률 (취약성)</h5>
      <div role="img" aria-label="공격 기법별 성공률 차트: 패치(Hiding) 82%, PGD 65%, 딥보이스 우회 45%, FGSM 22%">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value}%`, '성공률']} />
            <Bar dataKey="rate" fill="#2d72d2" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
