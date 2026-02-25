import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FormTemplate, FormStep } from '../../types';
import { submitForm } from '../../services/api/formService';
import { isOnline } from '../../services/sync/offlineUtils';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../../components/common/Button';
import { showSuccess, showError, showInfo } from '../../components/common/Toast';
import { handleError } from '../../utils/errorHandler';

type FormReviewScreenProps = NativeStackScreenProps<any, 'FormReview'>;

interface SubmissionData {
  formTemplate: FormTemplate;
  responses: Record<string, any>;
  taskId?: string;
}

const getFieldLabel = (step: FormStep): string => {
  switch (step.type) {
    case 'auto_filled':
      return 'Auto-filled';
    case 'photo_capture':
      return 'Photos';
    case 'signature':
      return 'Signature';
    case 'pass_fail':
      return 'Pass/Fail';
    case 'multi_select':
      return 'Selected';
    case 'checklist':
      return 'Checklist';
    case 'attendance':
      return 'Attendance';
    default:
      return 'Response';
  }
};

const formatValue = (value: any, fieldType: string): string => {
  if (value === null || value === undefined) {
    return 'No response';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'None selected';
    if (fieldType === 'photo_capture') return `${value.length} photo(s)`;
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export const FormReviewScreen: React.FC<FormReviewScreenProps> = ({ route, navigation }) => {
  const { submissionData } = route.params as { submissionData: SubmissionData };
  const { formTemplate, responses, taskId } = submissionData;

  const user = useSelector((state: RootState) => state.auth.user);
  const [submitting, setSubmitting] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEdit = useCallback(
    (fieldId: string) => {
      // Navigate back to form filling screen, which will preserve state
      navigation.goBack();
    },
    [navigation]
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);

    try {
      if (!user) {
        showError('User not authenticated. Please log in again.');
        return;
      }

      // Prepare submission
      const submission = {
        templateId: formTemplate.id,
        submittedBy: user.id,
        responses,
        completedAt: Date.now(),
        ...(taskId && { jobSiteId: taskId }),
      };

      // Submit form
      const result = await submitForm(user.companyId, submission);

      if (result) {
        const online = isOnline();
        if (online) {
          showSuccess('Form submitted successfully!');
        } else {
          showInfo('Form saved. Will sync when online.');
        }

        // Navigate back to home
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeMain' }],
          });
        }, 1500);
      } else {
        showError('Failed to submit form. Please try again.');
      }
    } catch (error) {
      handleError(error, 'FormSubmission');
    } finally {
      setSubmitting(false);
    }
  }, [user, formTemplate.id, responses, taskId, navigation]);

  const handleConfirmSubmit = useCallback(() => {
    Alert.alert(
      'Submit Form?',
      'Please review all information carefully before submitting. This action cannot be undone.',
      [
        { text: 'Edit', onPress: handleGoBack },
        {
          text: 'Submit',
          onPress: handleSubmit,
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  }, [handleSubmit, handleGoBack]);

  const renderPhotoThumbnails = (photos: any[]) => {
    if (!Array.isArray(photos) || photos.length === 0) {
      return <Text style={[TEXT_STYLES.body14, { color: COLORS.textLight }]}>No photos</Text>;
    }

    return (
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={styles.photoThumbnail}
            testID="photo-thumbnail"
          />
        )}
        keyExtractor={(_, index) => `photo-${index}`}
        horizontal
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ width: SPACING.sm }} />}
        style={styles.photoGrid}
      />
    );
  };

  const renderFieldResponse = (step: FormStep, index: number) => {
    const value = responses[step.id];
    const displayValue = formatValue(value, step.type);
    const isExpanded = expandedField === step.id;
    const isPhotoField = step.type === 'photo_capture' && Array.isArray(value) && value.length > 0;

    return (
      <TouchableOpacity
        key={step.id}
        style={[
          styles.fieldResponse,
          isExpanded && styles.fieldResponseExpanded,
          index !== formTemplate.steps.length - 1 && styles.fieldResponseBorder,
        ]}
        onPress={() => setExpandedField(isExpanded ? null : step.id)}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Review ${step.title}`}
      >
        <View style={styles.fieldHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldTitle, TEXT_STYLES.label]}>
              {step.title}
            </Text>
            {!isExpanded && (
              <Text
                style={[
                  styles.fieldValue,
                  TEXT_STYLES.body14,
                  {
                    color:
                      displayValue === 'No response' ? COLORS.textLight : COLORS.text,
                  },
                ]}
                numberOfLines={1}
              >
                {displayValue}
              </Text>
            )}
          </View>
          <Text style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>

        {isExpanded && (
          <View style={styles.fieldDetails}>
            {isPhotoField ? (
              renderPhotoThumbnails(value)
            ) : (
              <Text
                style={[
                  TEXT_STYLES.body14,
                  {
                    color:
                      displayValue === 'No response'
                        ? COLORS.textLight
                        : COLORS.text,
                  },
                ]}
              >
                {displayValue}
              </Text>
            )}
            <Button
              label="Edit This Field"
              onPress={() => handleEdit(step.id)}
              variant="secondary"
              size="sm"
              style={styles.editButton}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.headerButton, { color: COLORS.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, TEXT_STYLES.h1]}>
          Review
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={[TEXT_STYLES.body14, { color: COLORS.textLight }]}>
          {formTemplate.name}
        </Text>
        <Text style={[TEXT_STYLES.body12, { color: COLORS.textLight, marginTop: SPACING.xs }]}>
          Please review all information before submitting
        </Text>
      </View>

      {/* Field Responses */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
      >
        {formTemplate.steps.map((step, index) => renderFieldResponse(step, index))}

        {/* Submission Info */}
        <View style={styles.submissionInfo}>
          <Text style={[styles.infoLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Submitted by: {user?.fullName}
          </Text>
          <Text style={[styles.infoLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Date: {new Date().toLocaleDateString()}
          </Text>
          <Text style={[styles.infoLabel, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Status: {isOnline() ? '🟢 Online' : '🔴 Offline (will sync)'}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          label="Edit"
          onPress={handleGoBack}
          variant="secondary"
          disabled={submitting}
          style={styles.footerButton}
        />
        <Button
          label="Submit"
          onPress={handleConfirmSubmit}
          variant="success"
          disabled={submitting}
          loading={submitting}
          style={styles.footerButton}
          testID="submit-btn"
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
  summary: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  fieldResponse: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  fieldResponseExpanded: {
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  fieldResponseBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: SPACING.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fieldTitle: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  fieldValue: {
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  fieldDetails: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  photoGrid: {
    marginBottom: SPACING.md,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
  },
  editButton: {
    marginTop: SPACING.md,
  },
  submissionInfo: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  infoLabel: {
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
