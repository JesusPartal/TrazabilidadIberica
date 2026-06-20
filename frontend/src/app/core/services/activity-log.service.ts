import { Injectable, inject } from '@angular/core';
import { DbService } from './db.service';
import { AuthService } from './auth.service';
import type { ActivityLogRecord, ActivityAction } from '../models/activity-log';

export interface ActivityLogPage {
  items: ActivityLogRecord[];
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private db = inject(DbService);
  private auth = inject(AuthService);

  async log(
    entityName: string,
    entityId: string,
    action: ActivityAction,
    details: string | null = null,
  ): Promise<void> {
    const record: ActivityLogRecord = {
      id: crypto.randomUUID(),
      entityName,
      entityId,
      action,
      performedBy: this.auth.email() || 'desconocido',
      performedAt: new Date().toISOString(),
      details,
    };
    await this.db.activityLog.put(record);
  }

  async getAll(page = 1, pageSize = 50): Promise<ActivityLogPage> {
    const totalCount = await this.db.activityLog.count();
    const items = await this.db.activityLog
      .orderBy('performedAt')
      .reverse()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    return { items, totalCount };
  }

  async clearAll(): Promise<void> {
    await this.db.activityLog.clear();
  }
}
