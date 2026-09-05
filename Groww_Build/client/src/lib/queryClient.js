import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds fresh data
      gcTime: 5 * 60 * 1000, // 5 minutes cache retention
      retry: (failureCount, error) => {
        if (error?.code === 'UNAUTHORIZED' || error?.code === 'FORBIDDEN') return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: true,
    },
  },
});
