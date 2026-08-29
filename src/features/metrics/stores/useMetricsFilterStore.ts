import { create } from 'zustand';
import type { MetricStatus } from '../types/metric.schema';

interface MetricsFilterState {
  searchQuery: string;
  selectedStatus: MetricStatus | 'all';
  setSearchQuery: (query: string) => void;
  setSelectedStatus: (status: MetricStatus | 'all') => void;
  resetFilters: () => void;
}

export const useMetricsFilterStore = create<MetricsFilterState>((set) => ({
  searchQuery: '',
  selectedStatus: 'all',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  resetFilters: () => set({ searchQuery: '', selectedStatus: 'all' }),
}));