import { useCallback, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  const pageRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    currentRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetRef.current = { ...currentRef.current };
    if (pageRef.current) {
      pageRef.current.style.setProperty('--mouse-x', `${currentRef.current.x}px`);
      pageRef.current.style.setProperty('--mouse-y', `${currentRef.current.y}px`);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const animate = useCallback(() => {
    const lerp = 0.06;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;

    if (pageRef.current) {
      pageRef.current.style.setProperty('--mouse-x', `${currentRef.current.x}px`);
      pageRef.current.style.setProperty('--mouse-y', `${currentRef.current.y}px`);
    }

    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      isAnimatingRef.current = false;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [animate],
  );

  return (
    <div className="login-page bp6-dark" ref={pageRef} onMouseMove={handleMouseMove}>
      {/* 기본 점 격자 (어두운) */}
      <div className="login-bg-pattern" />

      {/* Spotlight: 마우스 주변만 밝아지는 격자 */}
      <div className="login-spotlight" />

      {/* 상단 로고 */}
      <div className="login-top-bar">
        <img src="/logo-aisc.svg" alt="AISC" className="login-brand-logo" />
      </div>

      {/* 중앙 폼 */}
      <div className="login-center">
        <Outlet />
      </div>

      {/* 하단 푸터 */}
      <footer className="login-bottom-bar">
        <span>AI안전성연구센터</span>
      </footer>
    </div>
  );
}
