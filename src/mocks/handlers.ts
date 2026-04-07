import { http, HttpResponse, delay } from 'msw';
import { API_BASE_URL } from '@/lib/constants';
import {
  MOCK_ATTACK_CATEGORIES,
  MOCK_DATASETS,
  MOCK_RESULTS,
  MODEL_ATTACK_MAP,
} from '@/lib/mock-data';

export const handlers = [
  // ==========================================
  // 인증
  // ==========================================
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      username: string;
      password: string;
    };

    if (body.username === 'admin' && body.password === 'admin') {
      return HttpResponse.json({
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 'user-001',
          username: 'admin',
          role: 'admin',
        },
      });
    }

    return HttpResponse.json(
      { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/auth/refresh`, async () => {
    await delay(200);
    return HttpResponse.json({
      accessToken: 'mock-access-token-refreshed-' + Date.now(),
    });
  }),

  // ==========================================
  // 공격 종류 조회
  // ==========================================
  http.get(`${API_BASE_URL}/attacks`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const modelType = url.searchParams.get('modelType') || '';

    const allowedCategoryIds = MODEL_ATTACK_MAP[modelType] || [];
    const filtered = MOCK_ATTACK_CATEGORIES.filter((cat) =>
      allowedCategoryIds.includes(cat.id)
    );

    return HttpResponse.json(filtered);
  }),

  // ==========================================
  // 공격 실행
  // ==========================================
  http.post(`${API_BASE_URL}/attack/execute`, async () => {
    await delay(800);
    const attackId = 'ATK-' + Date.now();
    return HttpResponse.json({ attackId });
  }),

  // ==========================================
  // 데이터셋 조회
  // ==========================================
  http.get(`${API_BASE_URL}/datasets`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort');

    let datasets = [...MOCK_DATASETS];
    if (sort === 'latest') {
      datasets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return HttpResponse.json(datasets);
  }),

  // ==========================================
  // 결과 목록 조회
  // ==========================================
  http.get(`${API_BASE_URL}/results/summary`, async () => {
    await delay(300);
    return HttpResponse.json({
      totalAttacks: 124,
      avgVulnerability: 62.4,
      mostVulnerableModel: { name: 'YOLOv5', rate: '98.5%' },
      mostLethalAttack: { name: 'Patch-Hiding', rate: '82.1%' },
    });
  }),

  http.get(`${API_BASE_URL}/results/:id`, async ({ params }) => {
    await delay(300);
    const result = MOCK_RESULTS.find((r) => r.id === params.id);
    if (result) return HttpResponse.json(result);
    // 동적 attackId로 접근 시 첫 번째 결과 반환
    return HttpResponse.json(MOCK_RESULTS[0]);
  }),

  http.get(`${API_BASE_URL}/results`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const model = url.searchParams.get('model');
    const attack = url.searchParams.get('attack');
    const search = url.searchParams.get('search');

    let filtered = [...MOCK_RESULTS];
    if (model) filtered = filtered.filter((r) => r.model === model);
    if (attack) filtered = filtered.filter((r) => r.attack === attack);
    if (search) filtered = filtered.filter((r) =>
      r.id.includes(search) || r.model.includes(search)
    );

    return HttpResponse.json({ data: filtered, total: filtered.length });
  }),

  http.delete(`${API_BASE_URL}/results/:id`, async () => {
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // ==========================================
  // 공격 데이터 저장
  // ==========================================
  http.post(`${API_BASE_URL}/datasets/save`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { attackId: string; name: string };
    return HttpResponse.json({
      id: 'DS-' + Date.now(),
      name: body.name,
      type: '생성된 공격 데이터',
      datasetType: 'noise_tensor',
      size: '2.3 MB',
      usage: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });
  }),
];
