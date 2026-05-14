import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';

// 이전 세션에서 MSW Service Worker 가 등록되어 있다면 언등록.
// MSW 가 완전히 제거된 이후로는 단순 정리용. 6개월 후 안전하게 제거 가능.
async function cleanupLegacyServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => r.active?.scriptURL.includes('mockServiceWorker'))
      .map((r) => r.unregister()),
  );
}

cleanupLegacyServiceWorker().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
