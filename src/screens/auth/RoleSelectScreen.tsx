import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface RoleSelectScreenProps {
  onSelectRole: (role: 'crew' | 'admin') => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🏗️</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, TEXT_STYLES.h2]}>Welcome</Text>
        <Text style={[styles.subtitle, TEXT_STYLES.body14]}>
          How are you signing in today?
        </Text>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          {/* Crew Option */}
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => onSelectRole('crew')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <Text style={styles.roleIcon}>👷</Text>
            </View>
            <View style={styles.roleContent}>
              <Text style={[styles.roleTitle, TEXT_STYLES.h4]}>I'm Crew</Text>
              <Text style={[styles.roleDesc, TEXT_STYLES.body12]}>
                Foreman, operator, laborer – sign in with phone #
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Admin Option */}
          <TouchableOpacity
            style={[styles.roleButton, styles.adminButton]}
            onPress={() => onSelectRole('admin')}
            activeOpacity={0.7}
          >
            <View style={[styles.roleIconContainer, styles.adminIconContainer]}>
              <Text style={styles.roleIcon}>👔</Text>
            </View>
            <View style={styles.roleContent}>
              <Text style={[styles.roleTitle, TEXT_STYLES.h4]}>I'm Admin</Text>
              <Text style={[styles.roleDesc, TEXT_STYLES.body12]}>
                Office, PM, super – sign in with email
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, TEXT_STYLES.body12]}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text style={[styles.footerLink, TEXT_STYLES.label]}>
              Ask your admin for an invite
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 36,
  },
  title: {
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textMid,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  adminButton: {
    borderColor: COLORS.admin,
    backgroundColor: COLORS.adminLight,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  adminIconContainer: {
    backgroundColor: COLORS.adminLight,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleDesc: {
    color: COLORS.textMid,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  footerText: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footerLink: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
});
