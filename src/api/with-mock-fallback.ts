export async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  mock: T | (() => T),
  endpointName: string,
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[${endpointName}] → mock fallback`, error);
    }
    return typeof mock === 'function' ? (mock as () => T)() : mock;
  }
}
