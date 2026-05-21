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

---

## ERR-002: DeepVoice E11000 duplicate key + dual-verifier 하드코드 잔재

### 발생일
2026-05-19

### 증상
- DeepVoice 공격 (RTVC/Tortoise/YourTTS/AVC) 실행 시 `E11000 duplicate key error collection: edge-ai-attack.attack_results index: attackId_1 dup key: { attackId: 'ATK-YYYYMMDD-HHMMSS' }`
- 모의공격 페이지를 새로 열어도 옛날 failed 된 attackId 의 dock/inline 진행 패널이 계속 노출됨
- 사용자가 "Resemblyzer 모델만 선택했는데 결과에 verifier 두 개가 나옴" 보고

### 원인 분석

**1) Backend 통합 코드가 `git stash` 에만 있고 master HEAD 에 없는 비대칭 상태**
- `dist/` 는 stash 코드로 컴파일된 상태로 운영 중
- source tree (master HEAD) 는 DeepVoice 코드 0%
- `git status` 만 보면 정상이지만 `git stash list` 에 936줄 격리됨
- 다음 `npm run build` 시 source 가 없는 `dist/services/deepvoice-results-parser.service.js` 가 삭제될 위험

**2) `attack-result.model.ts` 의 `attackId` 에 `unique: true` + dual-verifier hardcode 로직**
```ts
// ATTACK_PRESET_MAP['atk-rtvc'] (stash 의 옛 버전)
verifiers: ['ECAPA-TDNN', 'Resemblyzer'],  // 항상 둘 다 실행
```
→ 1 attackId 에 2 result row insert 시도 → unique 제약 위반

**3) `attackJobStore` Zustand persist 가 옛 failed activeJob 을 localStorage 에 영구 보관**
- 사용자가 어제 19:54 에 본 E11000 의 activeJob 이 다음 날에도 dock 에 표시
- "오늘 새로 실행했는데 또 오류" 라는 잘못된 보고로 이어짐

**4) ML 측 README v2 는 이미 `options.verifier` (singular) 단일 verifier 실행을 지원**
- 자동 unique `attackId` 생성 (`ATK-YYYYMMDD-HHMMSS-µs-uuid8` 포맷)
- backend 가 이를 활용하지 못하고 옛 dual-verifier 호출 유지

### 영향 범위

| 영역 | 영향 |
|---|---|
| Backend stash | 13 tracked files + 2 untracked (`deepvoice-results-parser.service.ts`, `contour-results-parser.service.ts`) — source/dist 비대칭 |
| Backend hardcode | `ATTACK_PRESET_MAP` voice presets (4개) 모두 `verifiers: [ECAPA, Resemblyzer]` 고정 |
| Mongo schema | `attackId: unique: true` 가 1 row/attackId 강제 |
| Frontend persist | `attackJobStore` 옛 v1 데이터가 stale dock 노출 |
| 사용자 UX | "내가 고른 verifier 가 무시되고 둘 다 실행됨" 혼동 |

### 해결 방법

**Backend (source/dist 동기화 + 단일 verifier 흐름)**:
1. `git stash apply` + `git checkout stash@{N} -- <files>` 로 working tree 동기화
2. `attack-result.model.ts` 의 `attackId` 에서 `unique: true` 제거 (sparse + indexed 유지). 옛 dual row 호환.
3. `AttackExecuteRequest` 에 `verifier?: DeepvoiceVerifier` 추가 (`src/types/contracts.ts`)
4. `attacks.controller.ts normalizeExecuteRequest` 에서 voice 공격 시 verifier 필수 검증 (`VERIFIER_REQUIRED`)
5. `ml-execution.service.ts buildDeepvoiceExecutionPlan` 에서 `preset.verifiers` 를 request.verifier 로 override → README v2 의 `options.verifier` (singular) 로 ML runner 에 전달
6. `attacks.service.ts buildDeepvoiceResults` 는 변경 없음 (이미 1:1 parsedRuns → results 매핑이라 자연스럽게 1 row 만 생성)

**Frontend (모델 선택 → verifier 매핑)**:
1. `AttackExecuteRequest.verifier` 필드 추가 (`src/types/attack.ts`)
2. `AttackExecutionPage.handleExecute` 에서 `selectedModelId` 로 verifier 유도:
   - `MDL-V-RES` → `Resemblyzer`
   - `MDL-V-ECAPA` → `ECAPA-TDNN`
3. voice 공격이면서 verifier 없으면 toast warning + early return
4. `ResultAnalysisTab.tsx` / `metadataRows.ts` 의 CSV 경로를 per-run 형식으로 갱신:
   - Before: `verification/{verifier}/results_0417/summary_results_{attack}.csv`
   - After: `results_raw/{runId}/{verifier}/summary_results_{synth}.csv`

**Persist 정리 (frontend)**:
1. `attackJobStore` 의 `persist` middleware 에 `version: 2` 추가
2. `migrate(persistedState, fromVersion)` — fromVersion < 2 면 `{ activeJob: null, isDockMinimized: false }` 반환
3. `onRehydrateStorage` — terminal status (failed/completed/cancelled) + 1시간 이상 경과 시 자동 clear
4. `ACTIVE_JOB_MAX_AGE_MS = 60 * 60 * 1000`

### 재발 방지

1. **stash 격리 코드 금지**: backend 통합 작업은 반드시 commit. `git status --short` 가 깨끗해도 `git stash list` 도 함께 확인.
2. **dist 빌드 전 source 무결성 검증**: `npx tsc --noEmit` 가 통과해야 `npm run build` 진행. 빌드 후 `ls dist/services/*.js` 로 핵심 파일 존재 확인.
3. **persist 변경 시 version bump 필수**: Zustand `persist` 의 schema 변경은 `version` 증가 + `migrate` 정의로 옛 데이터 무력화.
4. **Mongo unique index 신중하게**: "1 attack = N rows" 가능성 있는 도메인은 unique 대신 sparse index 사용. `id` (row-level unique) 와 `attackId` (조회용 index) 분리.
5. **E2E 검증**: 새 attack 실행 → Mongo row count → run_manifest.json 의 `options.verifier` 까지 확인.

### 교훈

- 사용자가 보고한 "오늘 새 오류" 가 실제로는 어제의 stale UI 잔여인 경우 — backend 로그의 timestamp 와 attackId 의 timestamp 를 대조 검증.
- 사용자 가설 ("두 verifier 가 동시에 들어가서 문제") 이 표면 증상에는 부합해도 진짜 원인 (schema unique + persist stale + dual hardcode 3중 합작) 과 다를 수 있음.
- 단일 attack ID 에 N row 가 정상인 도메인을 인식하지 못한 옛 schema 설계가 가장 깊은 원인.

---

## ERR-003: DeepVoice 결과 페이지 음성 샘플 mockup 노출

### 발생일
2026-05-19

### 증상
- 결과 → 상세 분석 → Prominent 섹션의 AudioPlayer 6개 모두 "음성 데이터 미연결 (by 승민)" placeholder 노출
- 실제 ML 공격은 정상 완료, CSV 메트릭 정상, run_result_manifest.json 도 존재

### 원인 분석

`deepvoice-results-parser.service.ts:144-168` 의 `pickAudioSamples()` 가 잘못된 경로를 찾고 있었음:

```ts
const audioDir = path.resolve(DEEPVOICE_RESULTS_VISUALIZATION_ROOT, runId, 'audio');
// → results_visualization/<runId>/audio/original_N.wav, synth_N.wav 만 찾음
```

ML 측 README v2 §13 명시:
> 일반 공격 실행에서는 `skip_visualization=true` **기본값** 유지. 새 spectrogram wav preview 가 꼭 필요할 때만 false.

→ `results_visualization/<runId>/audio/` 는 거의 생성되지 않음 → 6개 sample 의 `src=undefined` → frontend `AudioPlayer.tsx:33` 의 placeholder 노출.

README §2 / §10 / §11 가 권장하는 실제 매핑:
| 출처 | 필드 |
|---|---|
| §2 | `Dataset/demo_voice/<engine>/original.wav` + `Deepvoice.wav` — engine 별 **고정 1쌍** |
| §10 | "백엔드는 `run_result_manifest.json` 을 읽는 방식이 **가장 안전**" |
| §11 | `paths.demoOriginalWav`, `paths.demoDeepvoiceWav` 를 프론트에 노출 |

추가로 `Dataset/demo_voice/` 디렉토리에 대한 `express.static` mount 자체가 **없었음** — 설사 path 를 발급해도 frontend 가 접근 불가.

### 해결 방법

**1) Static mount 추가** (`src/config/ml-execution.ts`, `src/app.ts`):
```ts
export const DEEPVOICE_DEMO_VOICE_ROOT = path.resolve(
  DEEPVOICE_PROJECT_ROOT, 'Dataset/demo_voice',
);
export const DEEPVOICE_DEMO_VOICE_STATIC_BASE = '/api/static/deepvoice/demo_voice';

// app.ts
app.use(DEEPVOICE_DEMO_VOICE_STATIC_BASE, express.static(DEEPVOICE_DEMO_VOICE_ROOT));
```

**2) `pickAudioSamples()` 재작성** (manifest 우선 + engine fallback):
```ts
// 1. run_result_manifest.json 의 paths.demoOriginalWav/demoDeepvoiceWav 우선
const manifestPath = path.resolve(DEEPVOICE_RESULTS_RAW_ROOT, runId, 'run_result_manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  demoOriginalAbs = manifest?.paths?.demoOriginalWav;
  demoDeepvoiceAbs = manifest?.paths?.demoDeepvoiceWav;
}
// 2. manifest 누락/실패 시 engine 이름 기반 fallback
demoOriginalAbs ??= path.resolve(DEEPVOICE_DEMO_VOICE_ROOT, synth, 'original.wav');
demoDeepvoiceAbs ??= path.resolve(DEEPVOICE_DEMO_VOICE_ROOT, synth, 'Deepvoice.wav');

return [
  { label: `원본 음성 (${synth} 정상 화자)`, src: this.toDemoVoiceUrl(demoOriginalAbs) },
  { label: `공격 음성 (${synth} 합성)`, src: this.toDemoVoiceUrl(demoDeepvoiceAbs) },
];
```

**3) URL 변환 헬퍼 with path traversal 차단**:
```ts
private toDemoVoiceUrl(absPath: string): string | undefined {
  if (!absPath || !fs.existsSync(absPath)) return undefined;
  const rel = path.relative(DEEPVOICE_DEMO_VOICE_ROOT, absPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return undefined;
  const encoded = rel.split(path.sep).map(encodeURIComponent).join('/');
  return `${DEEPVOICE_DEMO_VOICE_STATIC_BASE}/${encoded}`;
}
```

### 재발 방지

1. **새 정적 자료 디렉토리 추가 시 static mount 동시 등록**: backend `src/config/*` 에 상수 추가하면 `src/app.ts` 의 mount 도 같은 PR 에서 변경.
2. **ML 측 README 의 "프론트 연결용 추천 응답 필드" 표 우선 참조**: 개발자가 임의로 walk/search 로직 짜기 전에 README 가 명시한 안전한 매핑 표를 먼저 확인.
3. **결과 fetch 시 manifest 우선 + filesystem fallback 패턴**: ML runner 가 명시적으로 emit 하는 manifest 가 가장 신뢰할 수 있는 진실 출처.

### 교훈

- "기본 mockup 노출" 은 frontend 가 의도적으로 보여주는 게 아니라 backend 가 `src=undefined` 보낸 결과인 경우가 많음 — frontend 보다 backend 부터 의심.
- `skip_visualization=true` 같은 ML 측 기본값을 backend 가 모르고 옛 visualization path 만 보면 placeholder 가 영구 노출됨.
- README 권장이 "실 run wav N쌍 walk" 보다 "manifest 기반 demo 1쌍" 인 이유: 12,500 wav 환경에서 directory walk 는 응답 지연 + 캐싱 부담이 큼.

---

## ERR-004: Visual Evidence 와 Prominent 의 sampleImages 중복 노출

### 발생일
2026-05-20

### 증상
- ImageNet 결과 (Contour 공격 등) 상세 분석 페이지에서 같은 "원본 이미지" + "공격 이미지" 가 두 번 노출
- 한 번은 Prominent 섹션의 `EvidenceRenderer`, 한 번은 Visual Evidence 섹션의 isImagenet 분기

### 원인 분석

`ResultAnalysisTab.tsx` 의 두 섹션이 같은 `visualEvidence.sampleImages[0]` 를 사용:

```tsx
// Prominent 섹션 (line 152)
<EvidenceRenderer evidence={visualEvidence} />
// → ImageEvidence 가 sampleImages[0].clean + patched 표시

// Visual Evidence 섹션 (line 282-293) — 중복
{isImagenet ? (
  <div style={{ padding: 16 }}>
    {visualEvidence!.sampleImages?.[0] && (
      <div style={{ display: 'grid', ... }}>
        <VisualEvidenceImage label="원본 이미지 (정상 분류)" src={visualEvidence!.sampleImages[0].clean} />
        <VisualEvidenceImage label="공격 이미지 (적대적 perturbation)" src={visualEvidence!.sampleImages[0].patched} />
      </div>
    )}
    {visualEvidence!.patchImage && <VisualEvidenceImage label="공격 성공률 및 SSIM 비교..." />}
  </div>
) : (...)}
```

ImageNet 외 케이스 (`else` 분기) 는 patchImage / confusionMatrix / ROC / valAccuracy 만 보여줘서 중복 없음 — ImageNet 분기에서만 발생.

### 해결 방법

`ResultAnalysisTab.tsx` 의 Visual Evidence isImagenet 분기에서 sampleImages 영역 제거:

```tsx
// 섹션 노출 조건에서 sampleImages.length 제거
{(visualEvidence?.patchImage ||
  visualEvidence?.confusionMatrix ||
  visualEvidence?.rocCurveComparison ||
  visualEvidence?.valAccuracyComparison) && (
  ...
  {isImagenet ? (
    <div style={{ padding: 16 }}>
      {/* sampleImages 영역 삭제 — Prominent 의 EvidenceRenderer 와 중복 */}
      {visualEvidence!.patchImage && (
        <VisualEvidenceImage label="공격 성공률 및 SSIM 비교 (4종 공격)" src={visualEvidence!.patchImage} />
      )}
    </div>
  ) : ...}
)}
```

### 재발 방지

1. **단일 책임 원칙**: Prominent = "한눈에 보는 핵심 증거" (sampleImages, patched/clean 1쌍), Visual Evidence = "추가 시각화" (patchImage, confusionMatrix, ROC, val accuracy). 같은 데이터 다른 섹션 노출 금지.
2. **EvidenceRenderer 가 voice/image 자동 분기**하므로 modelType 별 추가 분기 시에는 EvidenceRenderer 가 이미 처리한 것과 겹치지 않는지 확인.

### 교훈

- "추가 정보를 더 보여주면 친절" 이라는 직관이 같은 자료를 두 번 노출하는 결과로 이어짐 — 섹션 의도가 명확하면 중복 자동 회피.
- 한 컴포넌트 내 N 개 섹션이 같은 prop (`visualEvidence`) 을 받을 때는 섹션별 사용 필드를 코드 코멘트로 명시해 둘 것.
