/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let globalToast = null;

/**
 * Universal toast caller - works anywhere (inside or outside React components)
 */
export const toast = {
  success: (message, title, duration) => globalToast?.success(message, title, duration),
  error: (message, title, duration) => globalToast?.error(message, title, duration),
  warning: (message, title, duration) => globalToast?.warning(message, title, duration),
  info: (message, title, duration) => globalToast?.info(message, title, duration),
};

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_CONFIG = {
  success: {
    defaultTitle: 'Success',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    bgBadge: 'rgba(16, 185, 129, 0.15)',
  },
  error: {
    defaultTitle: 'Error Occurred',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    bgBadge: 'rgba(239, 68, 68, 0.15)',
  },
  warning: {
    defaultTitle: 'Attention',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgBadge: 'rgba(245, 158, 11, 0.15)',
  },
  info: {
    defaultTitle: 'Notification',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    bgBadge: 'rgba(168, 85, 247, 0.15)',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'success', title = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      type: TOAST_CONFIG[type] ? type : 'info',
      title: title || TOAST_CONFIG[type]?.defaultTitle || 'Notification',
      message: String(message || ''),
      duration: duration || 4000,
      exiting: false,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep maximum 5 on screen

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const success = useCallback((msg, title, duration) => addToast(msg, 'success', title, duration), [addToast]);
  const error = useCallback((msg, title, duration) => addToast(msg, 'error', title, duration), [addToast]);
  const warning = useCallback((msg, title, duration) => addToast(msg, 'warning', title, duration), [addToast]);
  const info = useCallback((msg, title, duration) => addToast(msg, 'info', title, duration), [addToast]);

  // Sync to module-level singleton and window
  useEffect(() => {
    globalToast = { success, error, warning, info, addToast, removeToast };
    window.toast = globalToast;

    // Intelligent window.alert interceptor so any native alert transforms into a sleek toast
    const originalAlert = window.alert;
    window.alert = (msg) => {
      const text = String(msg || '');
      if (text.toLowerCase().includes('success') || text.includes('✓')) {
        success(text);
      } else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('failed')) {
        error(text);
      } else if (text.toLowerCase().includes('fill') || text.toLowerCase().includes('required') || text.toLowerCase().includes('warning')) {
        warning(text);
      } else {
        info(text);
      }
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [success, error, warning, info, addToast, removeToast]);

  return (
    <ToastContext.Provider value={{ toast: globalToast, success, error, warning, info, addToast, removeToast }}>
      {children}

      {/* Floating Modern Toast Container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '420px',
          width: 'calc(100vw - 32px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
          const IconComponent = TOAST_ICONS[t.type] || Info;

          return (
            <div
              key={t.id}
              className={t.exiting ? 'toast-exit' : 'toast-enter'}
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px 18px',
                borderRadius: '14px',
                background: 'rgba(13, 13, 22, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${config.borderColor}`,
                boxShadow: `0 14px 35px -8px rgba(0, 0, 0, 0.6), 0 0 20px -3px ${config.glowColor}`,
                overflow: 'hidden',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Icon Badge */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: config.bgBadge,
                  border: `1px solid ${config.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.accentColor,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <IconComponent size={20} />
              </div>

              {/* Text Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <span>{t.title}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '12px',
                      background: config.bgBadge,
                      color: config.accentColor,
                      border: `1px solid ${config.borderColor}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t.type}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#cbd5e1',
                    marginTop: '4px',
                    lineHeight: '1.45',
                    wordBreak: 'break-word',
                  }}
                >
                  {t.message}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.background = 'transparent';
                }}
                title="Dismiss"
              >
                <X size={16} />
              </button>

              {/* Animated Progress Bar */}
              {t.duration > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    background: config.accentColor,
                    animation: `toastProgress ${t.duration}ms linear forwards`,
                    boxShadow: `0 0 8px ${config.accentColor}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    };
  }
  return context;
};

export default ToastContext;
