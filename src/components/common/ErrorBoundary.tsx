import React, { ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, RADIUS } from '../../theme';
import * as Sentry from '@sentry/react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>

            {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Error Details (Dev Only)</Text>
                <Text style={styles.debugText}>{this.state.error?.message}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.h2,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    ...TEXT_STYLES.body14,
    color: COLORS.textMid,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  debugContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    maxHeight: 150,
    width: '100%',
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  debugTitle: {
    ...TEXT_STYLES.label12,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  debugText: {
    ...TEXT_STYLES.body11,
    color: COLORS.text,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    minWidth: 200,
    alignItems: 'center',
  },
  retryButtonText: {
    ...TEXT_STYLES.label14,
    color: COLORS.white,
    fontWeight: '600',
  },
});
