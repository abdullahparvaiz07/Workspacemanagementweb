'use client';

import React, { useState } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { notificationService } from '@/services/notification.service';
import { toast } from 'sonner';
import { Bell, CheckCheck, Trash2, CheckCircle2, AlertTriangle, Info, UserPlus, MessageSquare } from 'lucide-react';

export function NotificationsView() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsReadInStore = useNotificationStore((s) => s.markAsRead);
  const markAllAsReadInStore = useNotificationStore((s) => s.markAllAsRead);
  const clearAllNotificationsInStore = useNotificationStore((s) => s.clearAllNotifications);
  const deleteNotificationInStore = useNotificationStore((s) => s.deleteNotification);

  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Unread'>('All');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTabFilter === 'Unread' && n.read) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-sky-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-stone-900 tracking-tight">Notifications</h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Updates, mentions, and task assignments.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              notificationService.markAllAsRead();
              markAllAsReadInStore();
              toast.success('All notifications marked as read.');
            }}
            className="flex items-center gap-2 bg-white border border-stone-200 text-stone-800 font-semibold px-4 py-2 rounded-full text-xs hover:bg-stone-50 shadow-2xs transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark all read</span>
          </button>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                notificationService.clearAllNotifications();
                clearAllNotificationsInStore();
                toast.info('All notifications cleared.');
              }}
              className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 rounded-full bg-white transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-1">
        <button
          onClick={() => setActiveTabFilter('All')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTabFilter === 'All'
              ? 'bg-stone-900 text-stone-50'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('Unread')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTabFilter === 'Unread'
              ? 'bg-stone-900 text-stone-50'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No notifications in this view.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                notificationService.markAsRead(notif.id);
                markAsReadInStore(notif.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                !notif.read ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-stone-100 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 mt-0.5">{getIcon(notif.type)}</div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{notif.title}</h4>
                  <p className="text-xs text-stone-600 font-normal mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    notificationService.deleteNotification(notif.id);
                    deleteNotificationInStore(notif.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
