# 에러 수정 로그

## ERR-001: Blueprint CSS 네임스페이스 불일치 (bp5 vs bp6)

### 발생일
2026-04-07

### 증상
- 사이드바 메뉴 텍스트가 검정색으로 표시됨 (다크 배경에서 안 보임)
- 사이드바 접힘 시 아이콘 가운데 정렬이 적용되지 않음
- 사이드바 다크 모드(`.bp5-dark`)가 적용되지 않음
- CSS에서 `!important`를 아무리 추가해도 스타일이 먹히지 않음

### 원인 분석

**Palantir Blueprint 6**은 CSS 클래스 네임스페이스를 `bp5`에서 **`bp6`**으로 변경했다.

```javascript
// node_modules/@blueprintjs/core/lib/esm/common/classes.js
let NS = "bp6";  // ← Blueprint 6의 실제 네임스페이스
```

그러나 프로젝트의 모든 CSS와 TSX 파일에서 이전 버전의 `bp5` 접두사를 사용하고 있었다.

```css
/* 우리가 작성한 CSS (잘못됨) */
.bp5-dark .app-sidebar { ... }           /* ← 매칭 안 됨 */
.apollo-edge-menu .bp5-menu-item { ... } /* ← 매칭 안 됨 */
```

```tsx
/* 우리가 작성한 TSX (잘못됨) */
<aside className="app-sidebar bp5-dark">  {/* ← 존재하지 않는 클래스 */}
<Button className="bp5-minimal" />        {/* ← 존재하지 않는 클래스 */}
```

Blueprint가 실제로 렌더링하는 HTML은 `bp6-menu-item`, `bp6-icon`, `bp6-fill` 등이므로, `bp5`를 타겟한 CSS 선택자가 **단 하나도 매칭되지 않았다.**

### 영향 범위

| 파일 유형 | 영향받은 파일 수 | bp5 사용 횟수 |
|-----------|----------------|--------------|
| CSS (`index.css`) | 1 | **54회** |
| TSX (컴포넌트) | **11개 파일** | 35+회 |
| **합계** | 12개 파일 | **89+회** |

**영향받은 TSX 파일 목록:**
- `src/layouts/DashboardLayout.tsx` — `bp5-dark`, `bp5-minimal`
- `src/pages/login/LoginPage.tsx` — `bp5-heading`, `bp5-text-muted`
- `src/pages/attack/components/StepModelSelect.tsx` — `bp5-heading`
- `src/pages/attack/components/StepAttackSelect.tsx` — `bp5-skeleton`, `bp5-text-muted`
- `src/pages/attack/components/StepDataSource.tsx` — `bp5-text-muted`
- `src/pages/attack/components/AttackProgressModal.tsx` — `bp5-text-muted`
- `src/pages/results/components/ResultAnalysisTab.tsx` — `bp5-heading`, `bp5-text-muted`
- `src/pages/results/components/ResultKpiCards.tsx` — `bp5-skeleton`
- `src/pages/results/components/ResultLogTable.tsx` — `bp5-heading`, `bp5-skeleton`, `bp5-code`
- `src/pages/results/components/SuccessRateChart.tsx` — `bp5-heading`
- `src/pages/results/components/AccuracyDropChart.tsx` — `bp5-heading`

### 해결 방법

전체 프로젝트에서 `bp5` → `bp6` 일괄 치환:

```bash
# CSS 파일
sed -i 's/bp5/bp6/g' src/index.css

# TSX 파일
find src -name "*.tsx" -exec grep -l "bp5" {} \; | while read f; do
  sed -i 's/bp5/bp6/g' "$f"
done
```

### 재발 방지

1. **Blueprint 버전 확인**: `@blueprintjs/core` 메이저 버전에 따라 네임스페이스가 다름
   - Blueprint 4: `bp4`
   - Blueprint 5: `bp5`
   - Blueprint 6: `bp6`

2. **네임스페이스 확인 방법**:
   ```bash
   grep "let NS" node_modules/@blueprintjs/core/lib/esm/common/classes.js
   ```

3. **CLAUDE.md 코딩 규칙에 추가**: Blueprint 유틸 클래스는 반드시 `bp6-` 접두사 사용

### 교훈

- Blueprint 공식 문서나 예시 코드가 이전 버전 기준일 수 있으므로, 실제 설치된 패키지의 네임스페이스를 반드시 확인할 것
- CSS 스타일이 `!important`로도 적용되지 않는다면, 선택자 자체가 매칭되지 않는 것을 의심할 것
- 디자인 시스템 마이그레이션 시 네임스페이스/접두사 변경 여부를 초기에 확인할 것
