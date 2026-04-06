import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <Outlet />
    </div>
  );
}
