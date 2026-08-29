import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/test/server';
import { MetricsGrid } from '../components/MetricsGrid';
import { useMetricsFilterStore } from '../stores/useMetricsFilterStore';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const renderComponent = (queryClient = createTestQueryClient()) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MetricsGrid />
    </QueryClientProvider>
  );
};

describe('MetricsGrid Integration', () => {
  beforeEach(() => {
    server.resetHandlers();
    useMetricsFilterStore.getState().resetFilters(); // Resetear filtros antes de cada test
  });

  it('muestra los skeletons de carga inicialmente', () => {
    renderComponent();
    expect(screen.getByTestId('metrics-loading')).toBeInTheDocument();
  });

  it('renderiza la lista de métricas exitosamente tras la respuesta de la API', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CPU Utilization')).toBeInTheDocument();
      expect(screen.getByText('Memory Heap Used')).toBeInTheDocument();
    });

    const metricCards = screen.getAllByTestId('metric-card');
    expect(metricCards.length).toBeGreaterThan(0);
  });

  it('renderiza el estado de error cuando el endpoint falla (500)', async () => {
    server.use(
      http.get('/api/v1/metrics', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('metrics-error')).toBeInTheDocument();
      expect(screen.getByText('Error al cargar las métricas')).toBeInTheDocument();
    });
  });

  it('filtra las métricas por texto de búsqueda', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CPU Utilization')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/buscar métrica por nombre/i);
    await user.type(searchInput, 'CPU');

    expect(screen.getByText('CPU Utilization')).toBeInTheDocument();
    expect(screen.queryByText('Memory Heap Used')).not.toBeInTheDocument();
    expect(screen.getByText('Mostrando 1 de 5 métricas')).toBeInTheDocument();
  });

  it('filtra las métricas por categoría de estado al hacer clic en un botón', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('CPU Utilization')).toBeInTheDocument();
    });

    const criticalButton = screen.getByRole('button', { name: /^critical$/i });
    await user.click(criticalButton);

    expect(screen.getByText('Database Connection Pool')).toBeInTheDocument();
    expect(screen.queryByText('CPU Utilization')).not.toBeInTheDocument();
    expect(screen.getByText('Mostrando 1 de 5 métricas')).toBeInTheDocument();
  });
});