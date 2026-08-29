import { http, HttpResponse, delay } from 'msw';
import { useChaosStore } from '@/features/chaos/stores/useChaosStore';

const generateHistory = (baseValue: number, variance: number) => {
  const now = Date.now();
  return Array.from({ length: 8 }).map((_, i) => ({
    timestamp: new Date(now - (7 - i) * 5000).toISOString(),
    value: Number((baseValue + (Math.random() * variance * 2 - variance)).toFixed(1)),
  }));
};

export const handlers = [
  http.get('/api/v1/metrics', async () => {
    const { forceError500, artificialDelay, corruptSchema } = useChaosStore.getState();

    // 1. Simular latencia artificial
    if (artificialDelay > 0) {
      await delay(artificialDelay);
    }

    // 2. Simular fallo de servidor (HTTP 500)
    if (forceError500) {
      return new HttpResponse(
        JSON.stringify({ message: 'Internal Server Error (Simulado por Chaos UI)' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Simular datos corruptos para probar validación Zod
    if (corruptSchema) {
      return HttpResponse.json([
        {
          id: 'm-corrupted',
          name: 'Corrupted Metric Data',
          value: 'NO_ES_UN_NUMERO', // Tipo inválido
          unit: '%',
          status: 'invalid_status_enum', // Enum inválido
          timestamp: 'fecha-invalida',
          history: [],
        },
      ]);
    }

    // Respuesta normal exitosa
    const metrics = [
      {
        id: 'm-1',
        name: 'CPU Utilization',
        value: Number((40 + Math.random() * 15).toFixed(1)),
        unit: '%',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        history: generateHistory(45, 8),
      },
      {
        id: 'm-2',
        name: 'Memory Heap Used',
        value: Math.floor(1400 + Math.random() * 80),
        unit: 'MB',
        status: 'warning',
        timestamp: new Date().toISOString(),
        history: generateHistory(1420, 40),
      },
      {
        id: 'm-3',
        name: 'API Latency (p99)',
        value: Number((115 + Math.random() * 20).toFixed(1)),
        unit: 'ms',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        history: generateHistory(120, 15),
      },
      {
        id: 'm-4',
        name: 'Throughput',
        value: Number((4800 + Math.random() * 150).toFixed(1)),
        unit: 'req/s',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        history: generateHistory(4850, 100),
      },
      {
        id: 'm-5',
        name: 'Database Connection Pool',
        value: Number((94 + Math.random() * 4).toFixed(1)),
        unit: '%',
        status: 'critical',
        timestamp: new Date().toISOString(),
        history: generateHistory(95, 3),
      },
    ];

    return HttpResponse.json(metrics);
  }),
];