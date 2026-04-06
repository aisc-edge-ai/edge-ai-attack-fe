import { http, HttpResponse, delay } from 'msw';
import { API_BASE_URL } from '@/lib/constants';
import {
  MOCK_ATTACK_CATEGORIES,
  MOCK_DATASETS,
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
