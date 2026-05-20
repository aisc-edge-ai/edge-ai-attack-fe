const EDGE_AI_BASENAME = '/edge-ai';

function normalizeBase(base: string): string {
  if (!base || base === '/') return '/';
  return base.endsWith('/') ? base : `${base}/`;
}

export function getAppBasename(): string {
  const viteBase = normalizeBase(import.meta.env.BASE_URL);
  if (viteBase !== '/') {
    return viteBase.slice(0, -1);
  }

  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    if (pathname === EDGE_AI_BASENAME || pathname.startsWith(`${EDGE_AI_BASENAME}/`)) {
      return EDGE_AI_BASENAME;
    }
  }

  return '';
}

export function stripAppBasename(pathname: string): string {
  const basename = getAppBasename();
  if (!basename) return pathname;
  if (pathname === basename) return '/';
  if (pathname.startsWith(`${basename}/`)) {
    return pathname.slice(basename.length) || '/';
  }
  return pathname;
}

export function withPublicPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = normalizeBase(getAppBasename() || import.meta.env.BASE_URL);
  return `${base}${cleanPath}`;
}

export function withAppBasename(path: string): string {
  const basename = getAppBasename();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basename}${cleanPath}`;
}
