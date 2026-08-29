import React from 'react';
import { useChaosStore } from '../stores/useChaosStore';
import { useQueryClient } from '@tanstack/react-query';
import { METRICS_QUERY_KEY } from '@/features/metrics/api/useMetrics';
import { Flame, RefreshCw, X, SlidersHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ChaosPanel: React.FC = () => {
  const {
    forceError500,
    artificialDelay,
    corruptSchema,
    isOpen,
    setForceError500,
    setArtificialDelay,
    setCorruptSchema,
    toggleOpen,
    resetAll,
  } = useChaosStore();

  const queryClient = useQueryClient();

  const triggerRefetch = () => {
    void queryClient.invalidateQueries({ queryKey: METRICS_QUERY_KEY });
  };

  const hasChaosActive = forceError500 || artificialDelay > 0 || corruptSchema;

  return (
    <aside className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante para abrir/cerrar */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-xs shadow-lg transition-all transform hover:scale-105 ${
            hasChaosActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          Chaos DevTools
          {hasChaosActive && <span className="w-2 h-2 rounded-full bg-red-400" />}
        </button>
      )}

      {/* Drawer / Ventana de Configuración */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-5 w-84 sm:w-96 text-gray-800 space-y-4">
          <header className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-sm">Chaos Testing Panel</h3>
            </div>
            <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </header>

          <section className="space-y-3 text-xs">
            {/* Control 1: Error 500 */}
            <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Simular Error HTTP 500</span>
              </div>
              <input
                type="checkbox"
                checked={forceError500}
                onChange={(e) => {
                  setForceError500(e.target.checked);
                  triggerRefetch();
                }}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>

            {/* Control 2: Corrupción de Esquema (Zod Error) */}
            <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Corromper Tipos (Zod Catch)</span>
              </div>
              <input
                type="checkbox"
                checked={corruptSchema}
                onChange={(e) => {
                  setCorruptSchema(e.target.checked);
                  triggerRefetch();
                }}
                className="w-4 h-4 accent-amber-600 rounded"
              />
            </label>

            {/* Control 3: Latencia artificial */}
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span>Latencia Artificial:</span>
                <span className="font-semibold text-indigo-600">{artificialDelay} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="500"
                value={artificialDelay}
                onChange={(e) => setArtificialDelay(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </section>

          <footer className="pt-2 flex gap-2">
            <button
              onClick={() => {
                resetAll();
                triggerRefetch();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Normalizar
            </button>
            <button
              onClick={triggerRefetch}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Forzar Fetch
            </button>
          </footer>
        </div>
      )}
    </aside>
  );
};