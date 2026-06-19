export interface SyncQueueItem {
  id?: number;
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  payload: unknown;
  createdAt: string;
  retryCount: number;
}

export interface SyncResponse {
  success: boolean;
  serverTimestamp: string;
  errors: SyncError[];
}

export interface SyncError {
  entityType: string;
  entityId: string;
  message: string;
}
