import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, RADIUS } from '../../theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

/**
 * Individual Toast component
 */
const ToastItem: React.FC<ToastProps> = ({ type, message, duration = 3000, onDismiss }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, opacity, onDismiss]);

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: '✓', bgColor: COLORS.success, color: 'white' };
      case 'error':
        return { icon: '✕', bgColor: COLORS.danger, color: 'white' };
      case 'warning':
        return { icon: '!', bgColor: COLORS.warning, color: 'white' };
      case 'info':
      default:
        return { icon: 'ℹ', bgColor: COLORS.info, color: 'white' };
    }
  };

  const { icon, bgColor, color } = getIconAndColor();

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <View style={[styles.toast, { backgroundColor: bgColor }]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
        <Text style={[styles.message, { color }]}>{message}</Text>
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={[styles.closeButton, { color }]}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

/**
 * Toast Container - manages multiple toasts
 */
interface ToastContainerProps {
  ref?: React.Ref<ToastContainerHandle>;
}

export interface ToastContainerHandle {
  show: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const ToastContainer = React.forwardRef<ToastContainerHandle, ToastContainerProps>(
  (props, ref) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const show = useCallback((type: ToastType, message: string, duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    }, []);

    const dismiss = useCallback((id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        show,
        success: (message, duration) => show('success', message, duration),
        error: (message, duration) => show('error', message, duration),
        warning: (message, duration) => show('warning', message, duration),
        info: (message, duration) => show('info', message, duration),
      }),
      [show]
    );

    return (
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </View>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
    justifyContent: 'flex-end',
    paddingBottom: SPACING.lg,
  },
  toastContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    flex: 1,
    ...TEXT_STYLES.body13,
    fontWeight: '500',
  },
  closeButton: {
    fontSize: 20,
    marginLeft: SPACING.sm,
    fontWeight: '300',
  },
});

// Global toast instance
let toastRef: React.RefObject<ToastContainerHandle> | null = null;

export const setToastRef = (ref: React.RefObject<ToastContainerHandle>) => {
  toastRef = ref;
};

export const showToast = (type: ToastType, message: string, duration?: number) => {
  toastRef?.current?.show(type, message, duration);
};

export const showSuccessToast = (message: string, duration?: number) => {
  toastRef?.current?.success(message, duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  toastRef?.current?.error(message, duration);
};

export const showWarningToast = (message: string, duration?: number) => {
  toastRef?.current?.warning(message, duration);
};

export const showInfoToast = (message: string, duration?: number) => {
  toastRef?.current?.info(message, duration);
};
