import { Activity } from '@/types';
import { storageService } from './storage.service';

class ActivityService {
  public getActivities(workspaceId?: string): Activity[] {
    const logs = storageService.getTable('activities');
    if (workspaceId) {
      return logs.filter((a) => a.workspaceId === workspaceId);
    }
    return logs;
  }

  public logActivity(
    paramsOrWorkspaceId:
      | {
          workspaceId: string;
          userId: string;
          userName: string;
          userAvatar: string;
          action: string;
          entityType: Activity['entityType'];
          entityName: string;
        }
      | string,
    userId?: string,
    userName?: string,
    userAvatar?: string,
    action?: string,
    entityType?: Activity['entityType'],
    entityName?: string
  ): Activity {
    let workspaceIdStr = '';
    let userIdStr = '';
    let userNameStr = '';
    let userAvatarStr = '';
    let actionStr = '';
    let entityTypeVal: Activity['entityType'] = 'task';
    let entityNameStr = '';

    if (typeof paramsOrWorkspaceId === 'object') {
      workspaceIdStr = paramsOrWorkspaceId.workspaceId;
      userIdStr = paramsOrWorkspaceId.userId;
      userNameStr = paramsOrWorkspaceId.userName;
      userAvatarStr = paramsOrWorkspaceId.userAvatar;
      actionStr = paramsOrWorkspaceId.action;
      entityTypeVal = paramsOrWorkspaceId.entityType;
      entityNameStr = paramsOrWorkspaceId.entityName;
    } else {
      workspaceIdStr = paramsOrWorkspaceId;
      userIdStr = userId || '';
      userNameStr = userName || '';
      userAvatarStr = userAvatar || '';
      actionStr = action || '';
      entityTypeVal = entityType || 'task';
      entityNameStr = entityName || '';
    }

    const newLog: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      workspaceId: workspaceIdStr,
      userId: userIdStr,
      userName: userNameStr,
      userAvatar: userAvatarStr,
      action: actionStr,
      entityType: entityTypeVal,
      entityName: entityNameStr,
      timestamp: new Date().toISOString(),
    };

    storageService.updateTable('activities', (list) => [newLog, ...list]);
    return newLog;
  }

  public clearActivities(workspaceId: string): Activity[] {
    return storageService.updateTable('activities', (list) =>
      list.filter((a) => a.workspaceId !== workspaceId)
    );
  }
}

export const activityService = new ActivityService();
