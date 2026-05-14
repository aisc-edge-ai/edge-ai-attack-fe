# API Contract — Edge AI Attack Simulation

백엔드 개발자가 구현해야 할 전체 REST API + WebSocket 엔드포인트 명세.
프론트엔드 타입 정의는 `src/types/` 참조.

## Base URL

| 환경 | REST API | WebSocket |
|------|----------|-----------|
| Dev | `http://localhost:8080` | `ws://localhost:8080/ws` |
| Prod | `/` (nginx 프록시) | `/ws` (nginx 프록시) |

## 인증 헤더

로그인 후 모든 요청에 JWT 토큰 첨부:
```
Authorization: Bearer {accessToken}
```
401 응답 시 프론트에서 자동으로 `/auth/refresh` 호출 후 재시도.

---

## 1. Authentication

### POST /auth/login
사용자 로그인.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "accessToken": "jwt-token-string",
  "refreshToken": "refresh-token-string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "admin" | "user"
  }
}
```

**Response (401):**
```json
{ "message": "아이디 또는 비밀번호가 올바르지 않습니다." }
```

### POST /auth/refresh
액세스 토큰 갱신.

**Request:**
```json
{ "refreshToken": "string" }
```

**Response (200):**
```json
{ "accessToken": "new-jwt-token-string" }
```

---

## 2. Models

### GET /models
사용 가능한 AI 모델 목록 조회.

**Response (200):**
```json
[
  {
    "id": "MDL-001",
    "name": "YOLOv5",
    "type": "객체 탐지",
    "modelType": "cctv",
    "framework": "PyTorch",
    "node": "CCTV Node 01",
    "status": "active",
    "registeredAt": "2026-02-01"
  }
]
```

**modelType 값:** `"cctv"` | `"voice"` | `"autonomous"` | `"classification"`
**status 값:** `"active"` | `"testing"` | `"offline"`

> `"classification"` 은 이미지 분류 모델(예: CNN/ResNet/VGG/AlexNet, CIFAR-10) — Model Type Inference (MTC) 공격 대상. mock provider 단계에서는 4개 모델을 1 entry 로 묶어서 반환 (`"이미지 분류 모델 4종"`).

---

## 3. Attacks

### GET /attack?modelType={string}
모델 타입별 사용 가능한 공격 유형 조회.

**Query Params:**
- `modelType` (required): `"cctv"` | `"voice"` | `"autonomous"` | `"classification"`

**Response (200):**
```json
[
  {
    "id": "cat-adversarial",
    "name": "적대적 공격",
    "children": [
      { "id": "atk-fgsm", "name": "FGSM", "categoryId": "cat-adversarial", "enabled": false },
      { "id": "atk-bim", "name": "BIM", "categoryId": "cat-adversarial", "enabled": false },
      { "id": "atk-pgd", "name": "PGD", "categoryId": "cat-adversarial", "enabled": false }
    ]
  },
  {
    "id": "cat-patch",
    "name": "적대적 패치 공격",
    "children": [
      { "id": "atk-hiding", "name": "Hiding", "categoryId": "cat-patch" },
      { "id": "atk-creating", "name": "Creating", "categoryId": "cat-patch" },
      { "id": "atk-altering", "name": "Altering", "categoryId": "cat-patch" }
    ]
  }
]
```

### POST /attack/execute
모의 공격 실행 (비동기 처리).

**Request:**
```json
{
  "modelType": "cctv",
  "attackTypeIds": ["atk-hiding"],
  "dataSource": "generate",
  "datasetIds": ["DS-001"]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `modelType` | `"cctv"` \| `"voice"` \| `"autonomous"` | 모델 유형 |
| `attackTypeIds` | `string[]` | 1개 이상 — 다중 공격 동시 실행 지원 |
| `dataSource` | `"generate"` \| `"load"` | 'generate' = 백엔드가 데이터 생성, 'load' = 기존 데이터셋 사용 |
| `datasetIds` | `string[]` | `dataSource='load'` 면 1개 이상, `'generate'` 면 빈 배열 |

**Response (200):**
```json
{ "attackId": "ATK-1234567890" }
```

공격은 비동기로 실행되며, 진행 상황은 WebSocket으로 전송.

### POST /attack/{attackId}/cancel
실행 중인 공격 취소.

**Response (200):** 빈 body 또는 `{ "cancelled": true }`. 클라이언트는 status 만 확인.

### WS /ws/attack/{attackId}/progress
공격 실행 진행 상황 실시간 수신.

**메시지 형식 (서버 → 클라이언트):**
```json
{
  "attackId": "ATK-1234567890",
  "status": "running",
  "progress": 64,
  "total": 100,
  "currentStep": "적대적 데이터 생성 중... (64/100)",
  "eta": 7
}
```

**status 값:** `"preparing"` | `"running"` | `"saving"` | `"completed"` | `"failed"`

완료 시 `status: "completed"`, `progress === total`로 전송 후 연결 종료.

---

## 4. Datasets

### GET /datasets?type={string}&sort={string}
저장된 공격 데이터셋 목록 조회.

**Query Params (optional):**
- `type`: 데이터셋 타입 필터
- `sort`: `"latest"` (생성일 내림차순)

**Response (200):**
```json
[
  {
    "id": "DS-001",
    "name": "Person-Hiding Patch v2",
    "type": "적대적 패치 (이미지)",
    "datasetType": "image_patch",
    "size": "1.2 MB",
    "usage": 45,
    "createdAt": "2026-02-11"
  }
]
```

**datasetType 값:** `"image_patch"` | `"audio_noise"` | `"noise_tensor"`

### GET /datasets/visualization?attackTypeIds=&kind=
공격 위자드 마지막 step 에서 미리보기용 데이터셋 조회.

**Query Params:**
- `attackTypeIds` (required): 선택된 공격 ID 들을 콤마로 연결한 CSV (e.g., `"atk-hiding,atk-pgd"`)
- `kind` (required): `"latest"` (최신) | `"fixed"` (고정 샘플)

**Response (200):** `Dataset[]` (위와 동일 형식)

### POST /datasets
새 데이터셋 업로드. `multipart/form-data`.

**Response (200):** Dataset 객체

### POST /datasets/save
공격 실행 후 생성된 데이터를 데이터셋으로 저장.

**Request:**
```json
{
  "attackId": "ATK-1234567890",
  "name": "My Attack Dataset"
}
```

**Response (200):** Dataset 객체

### DELETE /datasets/{id}
데이터셋 삭제.

**Response (200):**
```json
{ "success": true }
```

---

## 5. Results

### GET /results?model=&attack=&search=&page=&size=
공격 결과 목록 조회 (페이지네이션 + 필터). **리스트 뷰**에서 사용되며, 기본 필드만
포함해도 됨. 상세 탐지 지표(AP/AR/confThreshold 등)는 `GET /results/{id}` 에 포함.

**Query Params (optional):**
- `model`: 모델명 필터 (e.g., `"YOLOv5"`)
- `attack`: 공격 종류 필터 (e.g., `"Patch-Hiding"`)
- `search`: 로그 ID 또는 모델명 검색
- `page`: 페이지 번호 (0-based)
- `size`: 페이지 크기 (기본 20)

**Response (200):**
```json
{
  "data": [
    {
      "id": "LOG-20260212-001",
      "date": "2026-02-12 10:30",
      "model": "YOLOv5",
      "modelType": "객체 탐지",
      "attack": "Patch-Hiding",
      "successRate": "76.47%",
      "beforeAccuracy": "95.2%",
      "afterAccuracy": "22.4%",
      "risk": "vulnerable"
    }
  ],
  "total": 124
}
```

**risk 값:** `"vulnerable"` | `"warning"` | `"safe"`

> 리스트 응답의 각 row에도 아래 상세 지표 필드들을 **선택적으로** 포함할 수
> 있음. 프론트는 `undefined` 를 안전하게 fallback 처리함. 단, 리스트 API가
> 무거워지는 것이 우려되면 detail endpoint 에만 포함해도 무방.

### GET /results/{id}
특정 결과 상세 조회. **모의 공격 결과 페이지의 "상세 결과 분석" 탭**에서 사용.
기본 필드 + 탐지 지표(Detection metrics) 전체가 포함되어야 함.

**Response (200):**
```json
{
  "id": "LOG-20260212-001",
  "date": "2026-02-12 10:30",
  "model": "YOLOv5",
  "modelType": "객체 탐지",
  "attack": "Patch-Hiding",
  "successRate": "76.47%",
  "beforeAccuracy": "95.2%",
  "afterAccuracy": "22.4%",
  "risk": "vulnerable",

  "beforeAP": "0.996",
  "afterAP": "0.524",
  "beforeAR": "0.997",
  "afterAR": "0.561",
  "attackSuccessRate": "100%",
  "confThreshold": 0.4,
  "averageCIoU": 0.308,
  "dataset": "demo_hiding_test"
}
```

#### 탐지 지표 필드 스펙 (Detection Metrics)

| 필드 | 타입 | 필수 | 설명 | 출처 |
|------|------|------|------|------|
| `beforeAP` | string | optional | 공격 전 Average Precision. 문자열로 전달 (`"0.996"` 형식) | `clean_map_stats.txt` |
| `afterAP` | string | optional | 공격 후 Average Precision | `patch_map_stats.txt` |
| `beforeAR` | string | optional | 공격 전 Average Recall | `clean_map_stats.txt` |
| `afterAR` | string | optional | 공격 후 Average Recall | `patch_map_stats.txt` |
| `attackSuccessRate` | string | optional | 공격 성공률 (퍼센트 문자열, e.g., `"100%"`). 기존 `successRate` 보다 구체적인 지표. | 백엔드 계산 |
| `confThreshold` | number | optional | 객체 탐지 confidence threshold (0.0 ~ 1.0). Metadata 테이블에 노출 | 평가 설정 |
| `averageCIoU` | number | optional | 평균 Complete IoU (0.0 ~ 1.0). Metadata 테이블에 노출 | 백엔드 계산 |
| `dataset` | string | optional | 평가에 사용한 테스트 데이터셋 이름. Vulnerability Assessment prose 에 삽입 (e.g., `"해당 YOLOv5은 demo_hiding_test에 대한 Patch 공격에 대해..."`) | 실행 시 입력 |
| `inferenceAccuracy` | object | optional | **MTC 전용** — `{ baseline, blackbox, graybox }` 각 0~100 정수. PDF 결과 표 (Probability / +Feature1 / +Feature1+Feature2) 의 best validation accuracy | `results_raw/comparison/summary_comparison.csv` |

#### MTC 결과의 `detail.visualEvidence` 필드 (선택)

| 필드 | 타입 | 설명 |
|------|------|------|
| `confusionMatrixCombined` | string | 4모델 × 3방법 confusion matrix 합본 이미지 URL — Prominent 좌측 영역에 렌더 |
| `rocCurveComparison` | string | 방법별 Averaged ROC curve 이미지 URL — Visual Evidence 섹션 |
| `valAccuracyComparison` | string | 방법별 Validation Accuracy 학습곡선 이미지 URL — Visual Evidence 섹션 |

> 백엔드는 이 이미지들을 `/artifacts/{resultId}/...` 와 같은 정적 자산 path 로 제공.
> mock 단계에서는 `/mtc-samples/*.png` (`public/mtc-samples/` 정적 자산) 로 응답.

**프론트엔드 사용처**:
- `src/pages/results/components/ResultAnalysisTab.tsx`
- Prominent 6-칸 지표 strip: `beforeAP`, `afterAP`, `beforeAR`, `afterAR`, AP Drop (클라이언트 계산), `attackSuccessRate`
- Metadata 테이블: `model`, `modelType`, `attack`, `confThreshold`, `averageCIoU`
- Vulnerability Assessment 요약 문장: `model`, `dataset`, `attack`, `attackSuccessRate`, `risk`

**타입 호환성**: 모든 필드는 optional 이므로 백엔드가 일부만 내려줘도 프론트는 `-` 로
fallback 렌더. 그러나 객체 탐지(`modelType === "객체 탐지"`) 결과에 대해서는 AP/AR 계열
필드가 채워지는 것을 권장 (비어있으면 Prominent 6-칸 중 5칸이 `-` 로 표시됨).

### GET /results/summary
결과 요약 KPI 데이터.

**Response (200):**
```json
{
  "totalAttacks": 124,
  "avgVulnerability": 62.4,
  "mostVulnerableModel": { "name": "YOLOv5", "rate": "98.5%" },
  "mostLethalAttack": { "name": "Patch-Hiding", "rate": "82.1%" }
}
```

### DELETE /results/{id}
결과 삭제.

---

## 6. Dashboard

### GET /dashboard/summary
대시보드 통합 KPI.

**Response (200):**
```json
{
  "totalModels": 12,
  "totalAttacks": 3450,
  "avgSuccessRate": 24.8,
  "safetyVerified": 8,
  "modelsDelta": 2,
  "attacksDelta": 145,
  "successRateDelta": -1.2,
  "safetyVerifiedDelta": 1
}
```

`*Delta` 필드는 전 기간 대비 변화량(선택). 미구현 시 생략해도 됨 — UI 는 delta 없으면 변화량 칩을 숨김.

### Dashboard 보조 endpoint (mock 폴백 중)

아래 endpoint 는 백엔드 미구현 단계에서 프론트가 `withMockFallback` 으로 mock 데이터로 대체.
실제 응답이 200 으로 오기 전까지 클라이언트는 mock 으로 계속 동작 — 백엔드 구현 완료
시 코드 변경 없이 자동 전환.

| Endpoint | 응답 타입 | 참조 |
|----------|----------|------|
| `GET /dashboard/trend` | `DashboardTrendPoint[]` | `src/types/dashboard.ts` |
| `GET /dashboard/devices` | `DeviceStatus[]` | `src/types/dashboard.ts` |
| `GET /dashboard/model-vulnerabilities` | `ModelVulnerabilityScore[]` | `src/types/dashboard.ts` |
| `GET /dashboard/risk-distribution` | `RiskDistribution` | `src/types/dashboard.ts` |
| `GET /dashboard/recent-attacks` | `RecentLog[]` | `src/types/dashboard.ts` |

`risk` 필드 값: `"high"` | `"low"` | `"none"` (RecentLog 만 해당).

---

## 에러 응답 형식 (공통)

```json
{
  "message": "에러 메시지",
  "code": "ERROR_CODE"  // optional
}
```

| HTTP Status | 의미 |
|-------------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 (토큰 만료/잘못됨) |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 500 | 서버 에러 |

---

## 응답 형태 표준

- **페이지네이션**: `{ data: T[], total: number }` (현재 `GET /results` 만 사용 — `PaginatedResponse<T>` in `src/types/common.ts`)
- **단건 리소스**: 객체 그대로
- **목록 (페이지네이션 없음)**: `T[]` (예: `/models`, `/datasets`, `/attack`)
- **에러**: `{ message: string, code?: string }` (HTTP status 와 함께)

## 백엔드 미구현 영역 정리

| 영역 | 상태 | 비고 |
|------|------|------|
| Auth refresh | 구현 필요 | 클라이언트가 401 → /auth/refresh 호출하는 흐름 작동 검증 필요 |
| `/auth/logout` | 미구현 (선택) | 토큰 블랙리스트 필요 시 구현 |
| Dashboard 보조 5종 | mock 폴백 중 | 위 표 참조 |
| Voice 모델 (Resemblyzer/ECAPA-TDNN) | mock provider | hook 단에서 mock 응답 — 백엔드는 신경 X (`src/lib/mock-providers.ts`) |
| Whisper 모델 | 백엔드 구현 (`/models` 에 포함) | mock 모델과 hook 단에서 자연 병합 |
| MTC (classification 모델군) | **백엔드 통합 완료** | 백엔드가 `/models`, `/attack?modelType=classification`, `/datasets/visualization`, `/attack/execute`, `/results`, `/results/{id}` 모두 처리. 데이터셋 ID = `DS-MTC01` (CIFAR-10). Python 학습 epochs 는 `ML_MTC_EPOCHS` 환경변수로 단축 가능 (기본 5, 풀 학습 100). 정적 자산은 `/api/static/mtc/results_vis/{runId}/...` 로 서빙. |
