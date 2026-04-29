import { Card, Elevation } from '@blueprintjs/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// TODO: API 연동 시 결과 데이터에서 모델별 before/after 정확도를 집계하여 동적 데이터로 교체
const data = [
  { model: 'YOLOv5', before: 95, after: 22 },
  { model: 'ResNet', before: 99, after: 12 },
  { model: 'Whisper', before: 96, after: 42 },
];

export function AccuracyDropChart() {
  return (
    <Card elevation={Elevation.ONE}>
      <h5 className="bp6-heading" style={{ marginBottom: 16 }}>모델별 평균 정확도 하락</h5>
      <div role="img" aria-label="모델별 정확도 하락 차트: YOLOv5 95→22%, ResNet 99→12%, Whisper 96→42%">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="model" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => [`${value}%`]} />
            <Legend />
            <Bar dataKey="before" name="공격 전" fill="#2d72d2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after" name="공격 후" fill="#ac2f33" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
