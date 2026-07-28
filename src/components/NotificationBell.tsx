"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNotification, Notification } from '@/contexts/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, ShoppingCart, Info, Check, Trash2 } from 'lucide-react';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch(type) {
      case 'booking': return <CheckCircle2 size={16} className="text-success" />;
      case 'support': return <AlertCircle size={16} className="text-error" />;
      case 'marketplace': return <ShoppingCart size={16} className="text-primary" />;
      default: return <Info size={16} className="text-on-surface-variant" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative"
      >
        <Bell size={18} className="text-on-surface" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse border border-surface"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full -right-2 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-surface-glass backdrop-blur-2xl border border-outline-variant/60 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-outline-variant/30 bg-surface/50 gap-2">
            <h3 className="font-bold text-[14px] text-on-surface flex items-center gap-2 shrink-0">
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2.5 shrink-0">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="text-[11px] font-medium text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
                <Bell size={32} className="opacity-20 mb-2" />
                <p className="text-[13px] font-medium">No notifications yet</p>
                <p className="text-[11px] mt-1">We'll let you know when something arrives!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => { if (!n.read) markAsRead(n.id); }}
                    className={`p-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-3 ${n.read ? 'opacity-60' : 'bg-primary/5'}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 break-words">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <p className={`text-[13px] leading-tight ${n.read ? 'font-medium text-on-surface-variant' : 'font-bold text-on-surface'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-on-surface-variant shrink-0 whitespace-nowrap pt-0.5">
                          {formatTime(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant leading-relaxed mt-1 break-words">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
