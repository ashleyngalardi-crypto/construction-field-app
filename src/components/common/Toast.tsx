import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

export interface ToastContainerHandle {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

// Global toast manager for easier usage
let toastQueue: ToastMessage[] = [];
let toastListeners: Array<(messages: ToastMessage[]) => void> = [];
let globalToastRef: React.RefObject<ToastContainerHandle> | null = null;

export const setToastRef = (ref: React.RefObject<ToastContainerHandle>) => {
  globalToastRef = ref;
};

export const addToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
  const id = `toast_${Date.now()}_${Math.random()}`;
  const toastMessage: ToastMessage = {
    id,
    message,
    type,
    duration,
  };

  toastQueue.push(toastMessage);
  toastListeners.forEach((listener) => listener([...toastQueue]));

  if (duration > 0) {
    setTimeout(() => {
      toastQueue = toastQueue.filter((t) => t.id !== id);
      toastListeners.forEach((listener) => listener([...toastQueue]));
    }, duration);
  }

  return id;
};

export const removeToast = (id: string) => {
  toastQueue = toastQueue.filter((t) => t.id !== id);
  toastListeners.forEach((listener) => listener([...toastQueue]));
};

export const showSuccess = (message: string, duration: number = 3000) => {
  return addToast(message, 'success', duration);
};

export const showError = (message: string, duration: number = 3000) => {
  return addToast(message, 'error', duration);
};

export const showInfo = (message: string, duration: number = 3000) => {
  return addToast(message, 'info', duration);
};

export const showWarning = (message: string, duration: number = 3000) => {
  return addToast(message, 'warning', duration);
};

// Single Toast Display Component
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onHide?.();
          });
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, slideAnim, duration, onHide]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: COLORS.success, icon: '✓' };
      case 'error':
        return { backgroundColor: COLORS.danger, icon: '✕' };
      case 'warning':
        return { backgroundColor: '#FFA502', icon: '!' };
      case 'info':
      default:
        return { backgroundColor: COLORS.primary, icon: 'ℹ' };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: typeStyles.backgroundColor }]}>
        <Text style={styles.icon}>{typeStyles.icon}</Text>
        <Text style={[styles.message, TEXT_STYLES.body14]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

// Toast Container Component - Use this at the root of your app
export const ToastContainer = forwardRef<ToastContainerHandle>((_, ref) => {
  // Note: The ref provides an alternative API, but the exported functions also work globally
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useImperativeHandle(ref, () => ({
    show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
      addToast(message, type, duration);
    },
  }));

  useEffect(() => {
    const listener = (msgs: ToastMessage[]) => {
      setMessages([...msgs]);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {messages.map((msg, index) => (
        <View
          key={msg.id}
          style={[
            styles.toastWrapper,
            {
              bottom: index * 70 + 20,
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={[styles.toast, { backgroundColor: getToastColor(msg.type) }]}>
            <Text style={styles.icon}>{getToastIcon(msg.type)}</Text>
            <View style={styles.messageContainer}>
              <Text style={[styles.message, TEXT_STYLES.body14]} numberOfLines={2}>
                {msg.message}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeToast(msg.id)}
              style={styles.closeButton}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
});

function getToastColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return COLORS.success;
    case 'error':
      return COLORS.danger;
    case 'warning':
      return '#FFA502';
    case 'info':
    default:
      return COLORS.primary;
  }
}

function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    case 'info':
    default:
      return 'ℹ';
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
    zIndex: 9999,
  },
  toastWrapper: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    pointerEvents: 'auto',
  },
  toastContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 24,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
