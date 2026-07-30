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
        <div 
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="absolute top-full -right-2 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-white border border-outline-variant/40 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-[9999] flex flex-col max-h-[420px] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-outline-variant/30 bg-surface/50 gap-2 z-10">
            <h3 className="font-bold text-[14px] text-on-surface flex items-center gap-2 shrink-0">
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-error text-white text-[10px] font-bold shadow-sm">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2.5 shrink-0">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="text-[11px] font-semibold text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>
          </div>

          <div 
            data-lenis-prevent="true" 
            className="flex-1 overflow-y-auto custom-scrollbar relative z-0 min-h-0 overscroll-contain"
          >
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-on-surface-variant flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                  <Bell size={20} className="text-on-surface-variant/50" />
                </div>
                <p className="text-[14px] font-semibold text-on-surface">You're all caught up!</p>
                <p className="text-[12px] mt-1">We'll notify you when something new arrives.</p>
              </div>
            ) : (
              <div className="flex flex-col pb-1">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => { if (!n.read) markAsRead(n.id); }}
                    className={`p-4 border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-3.5 relative ${!n.read ? 'bg-primary/[0.03]' : ''}`}
                  >
                    {!n.read && (
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>
                    )}
                    <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-outline-variant/30">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <p className={`text-[13px] leading-tight ${n.read ? 'font-medium text-on-surface-variant' : 'font-bold text-on-surface'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] font-medium text-on-surface-variant shrink-0 whitespace-nowrap pt-0.5">
                          {formatTime(n.timestamp)}
                        </span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 line-clamp-2 ${n.read ? 'text-on-surface-variant/80' : 'text-on-surface-variant'}`}>
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
