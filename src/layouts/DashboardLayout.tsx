import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Monitor, ShieldAlert, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTE_TITLES } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';

const navItems = [
  { to: '/dashboard', icon: Monitor, label: '대시보드' },
  { to: '/attack', icon: ShieldAlert, label: '모의 공격 수행' },
  { to: '/results', icon: BarChart3, label: '모의 공격 결과' },
  { to: '/projects', icon: Settings, label: '프로젝트 관리' },
];

export function DashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const basePath = '/' + location.pathname.split('/')[1];
  const pageTitle = ROUTE_TITLES[basePath] || '';

  return (
    <SidebarProvider>
      <Sidebar>
        {/* 사이드바 헤더: 로고 */}
        <SidebarHeader className="px-4 py-3">
          <h1 className="text-lg font-bold">엣지 AI 모의공격</h1>
        </SidebarHeader>

        {/* 사이드바 네비게이션 */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive =
                    basePath === item.to ||
                    (item.to === '/results' &&
                      location.pathname.startsWith('/results'));

                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} size="lg">
                        <NavLink to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* 사이드바 푸터: 로그아웃 */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} size="lg">
                <LogOut />
                <span>로그아웃</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* 메인 콘텐츠 영역 */}
      <SidebarInset>
        {/* 상단 헤더 */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="text-lg font-semibold">{pageTitle}</h2>
        </header>

        {/* 콘텐츠 바디 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-card border border-border rounded-lg h-full p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
