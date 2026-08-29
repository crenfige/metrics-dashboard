import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reintenta 2 veces antes de fallar
      staleTime: 1000 * 10, // 10 segundos los datos se consideran frescos
      gcTime: 1000 * 60 * 5, // 5 minutos en memoria caché
      refetchOnWindowFocus: true, // Auto-refresca si el usuario vuelve a la pestaña
    },
  },
});