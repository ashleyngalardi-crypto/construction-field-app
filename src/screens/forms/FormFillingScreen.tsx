import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FormTemplate, FormStep } from '../../types';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';
import { FormFieldRenderer } from '../../components/forms/FormFieldRenderer';
import { showError } from '../../components/common/Toast';
import { getErrorSummary } from '../../utils/errorHandler';

type FormFillingScreenProps = NativeStackScreenProps<any, 'FormFilling'>;

interface FormResponses {
  [fieldId: string]: any;
}

export const FormFillingScreen: React.FC<FormFillingScreenProps> = ({ route, navigation }) => {
  const { formTemplate, taskId } = route.params as {
    formTemplate: FormTemplate;
    taskId?: string;
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const [responses, setResponses] = useState<FormResponses>({});
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [validating, setValidating] = useState(false);

  // Initialize auto-filled fields
  const autoFilledData = useMemo(
    () => ({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      user: user?.fullName || 'Unknown',
      userId: user?.id || '',
    }),
    [user]
  );

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error for this field when user makes a change
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: { [key: string]: string } = {};

    formTemplate.steps.forEach((step: FormStep) => {
      const value = responses[step.id];

      // Check required fields
      if (step.type !== 'auto_filled') {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          errors[step.id] = `${step.title} is required`;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [responses, formTemplate.steps]);

  const handleNext = useCallback(async () => {
    setValidating(true);

    try {
      if (!validateForm()) {
        const errorSummary = getErrorSummary(fieldErrors);
        showError(errorSummary || 'Please fill in all required fields');
        setValidating(false);
        return;
      }

      // Prepare final submission data
      const submissionData = {
        formTemplate,
        responses: {
          ...autoFilledData,
          ...responses,
        },
        taskId,
      };

      // Navigate to review screen
      navigation.navigate('FormReview', { submissionData });
    } finally {
      setValidating(false);
    }
  }, [validateForm, responses, autoFilledData, taskId, navigation, formTemplate]);

  const handleBack = useCallback(() => {
    if (Object.keys(responses).length > 0) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to go back? Your progress will be lost.',
        [
          { text: 'Keep Editing', onPress: () => {} },
          {
            text: 'Discard',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [responses, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.headerButton, { color: COLORS.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>
          {formTemplate.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Subtitle */}
      {formTemplate.icon && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.icon}>{formTemplate.icon}</Text>
          <Text style={[styles.subtitle, TEXT_STYLES.body14, { color: COLORS.textLight }]}>
            {formTemplate.templateType} • {formTemplate.frequency}
          </Text>
        </View>
      )}

      {/* Form Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
      >
        {formTemplate.steps.map((step: FormStep) => (
          <View key={step.id} style={styles.fieldWrapper}>
            <FormFieldRenderer
              field={step}
              value={responses[step.id]}
              onChange={(value) => handleFieldChange(step.id, value)}
              error={fieldErrors[step.id]}
              disabled={!step.editable}
            />
          </View>
        ))}

        {/* Auto-filled Data Info */}
        <View style={styles.autoFilledInfo}>
          <Text style={[styles.autoFilledLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Auto-filled information:
          </Text>
          <Text style={[TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Date: {autoFilledData.date}
          </Text>
          <Text style={[TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Time: {autoFilledData.time}
          </Text>
          <Text style={[TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Submitted by: {autoFilledData.user}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          label="Cancel"
          onPress={handleBack}
          variant="secondary"
          disabled={validating}
          style={styles.footerButton}
        />
        <Button
          label="Review & Submit"
          onPress={handleNext}
          variant="primary"
          disabled={validating}
          loading={validating}
          style={styles.footerButton}
          testID="review-submit-btn"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  headerSpacer: {
    width: 50,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  subtitle: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  fieldWrapper: {
    marginBottom: SPACING.md,
  },
  autoFilledInfo: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  autoFilledLabel: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  footerButton: {
    flex: 1,
  },
});
