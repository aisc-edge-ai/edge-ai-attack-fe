# 디자인 시스템 레퍼런스 — Palantir Blueprint 6

## 개요

- **UI 라이브러리**: [Palantir Blueprint 6](https://blueprintjs.com/) (Apache 2.0)
- **스타일링**: Blueprint CSS (SASS 기반, 빌드된 CSS 사용)
- **아이콘**: `@blueprintjs/icons` (~600+ 아이콘)
- **폰트**: Pretendard Variable (한국어) + 시스템 폰트 fallback
- **테마**: 라이트 모드 기본, 다크 모드는 `.bp6-dark` 클래스 적용
- **CSS 프레임워크**: Tailwind CSS **미사용** — Blueprint CSS + 커스텀 CSS

## Blueprint Intent 시스템

Blueprint는 색상을 직접 지정하지 않고 **Intent** 시스템을 사용한다.

| Intent | 색상 | 용도 | 예시 |
|--------|------|------|------|
| `Intent.NONE` | 회색 | 기본/비활성 | 일반 버튼, 텍스트 |
| `Intent.PRIMARY` | 파랑 (#2d72d2) | 주요 액션 | 로그인 버튼, 활성 메뉴 |
| `Intent.SUCCESS` | 초록 (#0d8050) | 성공/안전 | RiskBadge "양호", 완료 상태 |
| `Intent.WARNING` | 주황 (#d9822b) | 경고/주의 | RiskBadge "위험(중/상)" |
| `Intent.DANGER` | 빨강 (#cd4246) | 위험/에러 | RiskBadge "치명적", 에러 toast |

```tsx
import { Button, Intent } from '@blueprintjs/core';

<Button intent={Intent.PRIMARY} text="로그인" />
<Button intent={Intent.DANGER} text="삭제" />
```

## 핵심 컴포넌트 사용 패턴

### Button
```tsx
import { Button, Intent } from '@blueprintjs/core';

<Button intent={Intent.PRIMARY} text="주요 액션" large />
<Button text="보조 액션" />
<Button intent={Intent.DANGER} text="위험" minimal />
<Button icon="refresh" text="새로고침" />
<Button loading={isLoading} text="처리 중..." />
```

### Card
```tsx
import { Card, Elevation } from '@blueprintjs/core';

<Card elevation={Elevation.ONE}>내용</Card>
<Card elevation={Elevation.TWO} interactive>클릭 가능한 카드</Card>
```

### FormGroup + InputGroup (폼)
```tsx
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Controller } from 'react-hook-form';

<FormGroup
  label="아이디"
  labelFor="username"
  intent={errors.username ? Intent.DANGER : Intent.NONE}
  helperText={errors.username?.message}
>
  <Controller
    name="username"
    control={control}
    render={({ field }) => (
      <InputGroup id="username" placeholder="입력" large {...field} />
    )}
  />
</FormGroup>
```

> **주의**: Blueprint `InputGroup`는 `inputRef` 사용. react-hook-form의 `register()`가 아닌 `Controller`를 사용해야 함.

### Dialog (모달)
```tsx
import { Dialog, DialogBody, DialogFooter, Button } from '@blueprintjs/core';

<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="모달 제목"
  icon="shield"
  canEscapeKeyClose={true}
  canOutsideClickClose={false}
>
  <DialogBody>내용</DialogBody>
  <DialogFooter actions={<Button text="확인" intent={Intent.PRIMARY} />} />
</Dialog>
```

### Tabs
```tsx
import { Tabs, Tab } from '@blueprintjs/core';

<Tabs id="my-tabs" selectedTabId={activeTab} onChange={setActiveTab} large>
  <Tab id="tab1" title="탭 1" panel={<TabContent1 />} />
  <Tab id="tab2" title="탭 2" panel={<TabContent2 />} />
</Tabs>
```

### HTMLTable
```tsx
import { HTMLTable } from '@blueprintjs/core';

<HTMLTable bordered striped interactive style={{ width: '100%' }}>
  <thead><tr><th>헤더1</th><th>헤더2</th></tr></thead>
  <tbody><tr><td>데이터1</td><td>데이터2</td></tr></tbody>
</HTMLTable>
```

### Tag (뱃지/상태)
```tsx
import { Tag, Intent } from '@blueprintjs/core';

<Tag intent={Intent.SUCCESS} minimal round>양호</Tag>
<Tag intent={Intent.DANGER} minimal round>치명적</Tag>
<Tag intent={Intent.WARNING} minimal round>위험(상)</Tag>
```

### HTMLSelect
```tsx
import { HTMLSelect } from '@blueprintjs/core';

<HTMLSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
  <option value="all">전체</option>
  <option value="type1">유형 1</option>
</HTMLSelect>
```

### Checkbox / RadioGroup
```tsx
import { Checkbox, RadioGroup, Radio } from '@blueprintjs/core';

<Checkbox checked={val} onChange={handler} label="옵션" />
<Checkbox indeterminate={someSelected} checked={allSelected} label="전체" />

<RadioGroup onChange={handler} selectedValue={value}>
  <Radio value="opt1" label="옵션 1" />
  <Radio value="opt2" label="옵션 2" />
</RadioGroup>
```

### ProgressBar
```tsx
import { ProgressBar, Intent } from '@blueprintjs/core';

<ProgressBar value={0.65} intent={Intent.PRIMARY} stripes animate />
```
> `value`는 0~1 범위 (퍼센트가 아님)

### NonIdealState (빈 상태)
```tsx
import { NonIdealState, Icon } from '@blueprintjs/core';

<NonIdealState
  icon={<Icon icon="search" size={48} />}
  title="결과 없음"
  description="검색 조건을 변경해보세요."
  action={<Button text="초기화" />}
/>
```

### Toast (알림)
```tsx
import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/lib/toaster';

const toaster = await AppToaster;
toaster.show({ message: '성공!', intent: Intent.SUCCESS, icon: 'tick' });
toaster.show({ message: '실패', intent: Intent.DANGER, icon: 'error' });
```

## 아이콘 사용법

```tsx
import { Icon } from '@blueprintjs/core';

<Icon icon="shield" size={20} />
<Icon icon="tick-circle" intent="success" size={16} />
```

### 프로젝트에서 사용하는 주요 아이콘

| 용도 | 아이콘 이름 |
|------|------------|
| 대시보드 | `desktop` |
| 모의 공격 | `shield` |
| 차트/결과 | `chart` |
| 설정/프로젝트 | `cog` |
| 로그아웃 | `log-out` |
| CCTV/카메라 | `camera` |
| 음성 | `headset` |
| 자율주행 | `drive-time` |
| 검색 | `search` |
| 다운로드 | `download` |
| 저장 | `floppy-disk` |
| 화살표 | `arrow-right`, `chevron-right` |
| 새로고침 | `refresh` |
| 완료 | `tick-circle`, `tick` |
| 경고 | `warning-sign` |
| 타겟 | `target` |

전체 아이콘 목록: https://blueprintjs.com/docs/#icons

## 레이아웃 CSS 클래스

커스텀 CSS 클래스는 `src/index.css`에 정의되어 있다.

| 클래스 | 용도 |
|--------|------|
| `.app-layout` | 전체 앱 flex 컨테이너 |
| `.app-sidebar` / `.collapsed` | 사이드바 (접기/펼치기) |
| `.sidebar-header` / `.sidebar-content` / `.sidebar-footer` | 사이드바 영역 |
| `.app-main` / `.app-header` / `.app-content` | 메인 영역 |
| `.content-card` | 콘텐츠 래핑 카드 |
| `.auth-layout` / `.auth-branding` / `.auth-form-panel` | 로그인 레이아웃 |
| `.step-indicator` / `.step-item` / `.step-number` / `.step-line` | 위자드 스텝 |
| `.model-card` / `.selected` | 모델 선택 카드 |
| `.radio-card` / `.selected` | 라디오 카드 스타일 |
| `.dataset-item` / `.selected` | 데이터셋 선택 아이템 |
| `.kpi-grid` / `.kpi-card-primary` | KPI 카드 그리드 |
| `.filter-bar` / `.filter-group` | 필터 바 |
| `.charts-grid` | 차트 2열 그리드 |
| `.wizard-footer` | 위자드 하단 네비게이션 |
| `.recommendation-card` / `.recommendation-section` | 보안 권고 카드 |
| `.evidence-grid` / `.evidence-panel` / `.danger` | 시각적 증거 |
| `.status-dot` / `.online` / `.offline` / `.warning` | 상태 표시 점 |
| `.animate-fade-in` | fadeIn 애니메이션 |

## Blueprint CSS 유틸 클래스

Blueprint에서 제공하는 유용한 유틸 클래스:

| 클래스 | 용도 |
|--------|------|
| `.bp6-text-muted` | 보조 텍스트 (회색) |
| `.bp6-text-small` | 작은 텍스트 |
| `.bp6-heading` | 제목 스타일 |
| `.bp6-skeleton` | 로딩 스켈레톤 |
| `.bp6-code` | 인라인 코드 |
| `.bp6-dark` | 다크 모드 (루트에 적용) |

## 금지 사항

- Tailwind CSS 유틸리티 클래스 사용 금지 (`flex`, `p-4`, `text-sm` 등)
- shadcn/ui 컴포넌트 import 금지 (프로젝트에서 완전 제거됨)
- HugeIcons import 금지 → `@blueprintjs/icons` 사용
- `lucide-react` import 금지
- `sonner` toast 사용 금지 → `AppToaster` (Blueprint OverlayToaster) 사용

## 차트 색상 (커스텀 CSS 변수)

Recharts에서 사용하는 Emerald 계열 차트 색상:

```css
--chart-1: #34d399;
--chart-2: #10b981;
--chart-3: #059669;
--chart-4: #047857;
--chart-5: #065f46;
```

사용: `fill="var(--chart-1)"` 형태로 Recharts에 전달.

## 패키지 목록

### 런타임 의존성
@blueprintjs/core, @blueprintjs/icons, @blueprintjs/select, @blueprintjs/table,
@blueprintjs/colors, @hookform/resolvers, @tanstack/react-query, axios,
classnames, date-fns, normalize.css, react@18, react-dom@18, react-hook-form,
react-router-dom, recharts, three, zod, zustand

### 개발 의존성
@vitejs/plugin-react, eslint, msw, typescript, vite, vitest, @testing-library/react

## 참조 링크

- Blueprint 공식 문서: https://blueprintjs.com/docs
- Blueprint 아이콘: https://blueprintjs.com/docs/#icons
- Blueprint GitHub: https://github.com/palantir/blueprint
