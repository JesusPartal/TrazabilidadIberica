export type ActivityAction = 'Creación' | 'Modificación' | 'Baja';

export interface ActivityLogRecord {
  id: string;
  entityName: string;
  entityId: string;
  action: ActivityAction;
  performedBy: string;
  performedAt: string;
  details: string | null;
}
