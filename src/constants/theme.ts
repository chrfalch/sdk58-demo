import type { Status } from '@/demos/registry';

// the system colors of each changelog label, so a label reads the same everywhere in the app.
export const StatusColors: Record<Status, string> = {
  Stable: '#34C759',
  New: '#007AFF',
  Beta: '#FF9500',
  Alpha: '#FF3B30',
  Experimental: '#8E8E93',
};
