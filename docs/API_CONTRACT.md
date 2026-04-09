# API Contract — Edge AI Attack Simulation

백엔드 개발자가 구현해야 할 전체 REST API + WebSocket 엔드포인트 명세.
프론트엔드 타입 정의는 `src/types/` 참조.

## Base URL

| 환경 | REST API | WebSocket |
|------|----------|-----------|
| Dev | `http://localhost:8080/api` | `ws://localhost:8080/ws` |
| Prod | `/api` (nginx 프록시) | `/ws` (nginx 프록시) |

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
    "name": "YOLOv8",
    "type": "객체 탐지",
    "modelType": "cctv",
    "framework": "PyTorch",
    "node": "CCTV Node 01",
    "status": "active",
    "registeredAt": "2026-02-01"
  }
]
```

**modelType 값:** `"cctv"` | `"voice"` | `"autonomous"`
**status 값:** `"active"` | `"testing"` | `"offline"`

---

## 3. Attacks

### GET /attacks?modelType={string}
모델 타입별 사용 가능한 공격 유형 조회.

**Query Params:**
- `modelType` (required): `"cctv"` | `"voice"` | `"autonomous"`

**Response (200):**
```json
[
  {
    "id": "cat-adversarial",
    "name": "적대적 공격",
    "children": [
      { "id": "atk-fgsm", "name": "FGSM", "categoryId": "cat-adversarial" },
      { "id": "atk-bim", "name": "BIM", "categoryId": "cat-adversarial" },
      { "id": "atk-pgd", "name": "PGD", "categoryId": "cat-adversarial" }
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
  "attackTypeIds": ["atk-fgsm", "atk-hiding"],
  "dataSource": "generate",
  "datasetId": "DS-001"  // dataSource가 "load"일 때만
}
```

**dataSource 값:** `"generate"` | `"load"`

**Response (200):**
```json
{ "attackId": "ATK-1234567890" }
```

공격은 비동기로 실행되며, 진행 상황은 WebSocket으로 전송.

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
공격 결과 목록 조회 (페이지네이션 + 필터).

**Query Params (optional):**
- `model`: 모델명 필터 (e.g., `"YOLOv8"`)
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
      "model": "YOLOv8",
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

### GET /results/{id}
특정 결과 상세 조회.

**Response (200):** AttackResult 객체

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
  "safetyVerified": 8
}
```

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
