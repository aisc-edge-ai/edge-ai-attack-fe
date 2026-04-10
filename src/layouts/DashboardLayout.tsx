import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, Menu, MenuItem, Navbar, NavbarGroup, NavbarHeading, Alignment, Icon } from '@blueprintjs/core';
import { useAuth } from '@/hooks/useAuth';
import { ROUTE_TITLES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: 'desktop' as const, label: '대시보드' },
  { to: '/attack', icon: 'shield' as const, label: '모의 공격 수행' },
  { to: '/results', icon: 'chart' as const, label: '모의 공격 결과' },
  { to: '/projects', icon: 'cog' as const, label: '프로젝트 관리' },
];

export function DashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = '/' + location.pathname.split('/')[1];
  const pageTitle = ROUTE_TITLES[basePath] || '';
  const [collapsed, setCollapsed] = useState(false);

  const activeNav = navItems.find(item => basePath === item.to) ||
    (location.pathname.startsWith('/results') ? navItems.find(item => item.to === '/results') : null);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={cn('app-sidebar bp6-dark', collapsed && 'collapsed')}>
        <div className="sidebar-header">
          <Button
            className="sidebar-toggle-btn"
            icon="menu"
            minimal
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          />
          {!collapsed && <span className="sidebar-title">Edge AI 보안 솔루션</span>}
        </div>

        <div className="sidebar-content">
          <Menu className="sidebar-menu">
            {navItems.map((item) => {
              const isActive =
                basePath === item.to ||
                (item.to === '/results' && location.pathname.startsWith('/results'));

              return (
                <MenuItem
                  key={item.to}
                  icon={item.icon}
                  text={collapsed ? undefined : item.label}
                  className={isActive ? 'active-menu-item' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.to);
                  }}
                />
              );
            })}
          </Menu>
        </div>

        <div className="sidebar-footer">
          <Menu className="sidebar-menu">
            <MenuItem
              icon="notifications"
              text={collapsed ? undefined : '알림'}
              onClick={() => { /* TODO: 알림 패널 */ }}
            />
            <MenuItem
              icon="user"
              text={collapsed ? undefined : '프로필'}
              onClick={() => { /* TODO: 프로필 메뉴 */ }}
            />
            <MenuItem
              icon="log-out"
              text={collapsed ? undefined : '로그아웃'}
              onClick={logout}
            />
          </Menu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <Navbar className="app-header">
          <NavbarGroup align={Alignment.LEFT}>
            {activeNav && (
              <div className="page-header-icon-cell">
                <Icon icon={activeNav.icon} size={24} />
              </div>
            )}
            <NavbarHeading className="page-title">
              {pageTitle}
            </NavbarHeading>
          </NavbarGroup>
        </Navbar>

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
