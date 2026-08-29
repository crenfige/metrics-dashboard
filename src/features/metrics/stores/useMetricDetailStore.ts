import { create } from 'zustand';
import type { Metric } from '../types/metric.schema';

interface MetricDetailState {
  selectedMetric: Metric | null;
  setSelectedMetric: (metric: Metric | null) => void;
  closeModal: () => void;
}

export const useMetricDetailStore = create<MetricDetailState>((set) => ({
  selectedMetric: null,
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
  closeModal: () => set({ selectedMetric: null }),
}));