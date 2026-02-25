import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PhotoUploadField } from './PhotoUploadField';
import { FormStep } from '../../types';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface FormFieldRendererProps {
  field: FormStep;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleSelectOption = (optionId: string) => {
    if (field.type === 'multi_select') {
      const currentValue = value || [];
      if (currentValue.includes(optionId)) {
        onChange(currentValue.filter((id: string) => id !== optionId));
      } else {
        onChange([...currentValue, optionId]);
      }
    } else {
      onChange(optionId);
    }
  };

  const renderTextInput = () => (
    <Input
      label={field.title}
      placeholder={field.placeholder}
      value={value || ''}
      onChangeText={onChange}
      multiline={field.multiline}
      numberOfLines={field.multiline ? 4 : 1}
      editable={!disabled && field.editable}
      error={error}
    />
  );

  const renderSelect = () => {
    const options = field.options || [];
    const isMulti = field.type === 'multi_select';
    const selectedValues = isMulti ? value || [] : [value];

    return (
      <View style={styles.container}>
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {field.title}
        </Text>
        <View style={styles.optionGroup}>
          {options.map((option) => (
            <Button
              key={option.id}
              label={option.label}
              onPress={() => handleSelectOption(option.id)}
              variant={selectedValues.includes(option.id) ? 'primary' : 'secondary'}
              size="sm"
              disabled={disabled || !field.editable}
              style={styles.optionButton}
            />
          ))}
        </View>
        {error && <Text style={[styles.error, { color: COLORS.danger }]}>{error}</Text>}
      </View>
    );
  };

  const renderChecklist = () => {
    const items = field.items || [];

    return (
      <View style={styles.container}>
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {field.title}
        </Text>
        <View style={styles.checklistContainer}>
          {items.map((item) => {
            const isChecked = (value || []).includes(item.id);
            return (
              <Button
                key={item.id}
                label={isChecked ? `✓ ${item.label}` : item.label}
                onPress={() => handleSelectOption(item.id)}
                variant={isChecked ? 'success' : 'secondary'}
                size="sm"
                disabled={disabled || !field.editable}
                style={styles.checklistButton}
              />
            );
          })}
        </View>
        {error && <Text style={[styles.error, { color: COLORS.danger }]}>{error}</Text>}
      </View>
    );
  };

  const renderPassFail = () => {
    const options = [
      { id: 'pass', label: 'Pass' },
      { id: 'fail', label: 'Fail' },
    ];

    return (
      <View style={styles.container}>
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {field.title}
        </Text>
        <View style={styles.optionGroup}>
          {options.map((option) => (
            <Button
              key={option.id}
              label={option.label}
              onPress={() => onChange(option.id)}
              variant={value === option.id ? (option.id === 'pass' ? 'success' : 'danger') : 'secondary'}
              size="sm"
              disabled={disabled || !field.editable}
              style={styles.optionButton}
            />
          ))}
        </View>
        {error && <Text style={[styles.error, { color: COLORS.danger }]}>{error}</Text>}
      </View>
    );
  };

  const renderPhotoCapture = () => (
    <PhotoUploadField
      label={field.title}
      value={value || []}
      onChange={onChange}
      disabled={disabled || !field.editable}
      error={error}
    />
  );

  const renderAutoFilled = () => (
    <View style={[styles.container, styles.autoFilledContainer]}>
      <Text style={[styles.label, TEXT_STYLES.label]}>
        {field.title}
      </Text>
      <View style={styles.autoFilledValue}>
        <Text style={[TEXT_STYLES.body14, { color: COLORS.text }]}>
          {value ? JSON.stringify(value) : 'Auto-filled'}
        </Text>
      </View>
    </View>
  );

  const renderAttendance = () => {
    const items = field.items || [];

    return (
      <View style={styles.container}>
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {field.title}
        </Text>
        <View style={styles.checklistContainer}>
          {items.map((item) => {
            const isChecked = (value || []).includes(item.id);
            return (
              <Button
                key={item.id}
                label={isChecked ? `✓ ${item.label}` : item.label}
                onPress={() => handleSelectOption(item.id)}
                variant={isChecked ? 'primary' : 'secondary'}
                size="sm"
                disabled={disabled || !field.editable}
                style={styles.checklistButton}
              />
            );
          })}
        </View>
        {error && <Text style={[styles.error, { color: COLORS.danger }]}>{error}</Text>}
      </View>
    );
  };

  const renderField = () => {
    switch (field.type) {
      case 'text_input':
        return renderTextInput();
      case 'single_select':
        return renderSelect();
      case 'multi_select':
        return renderSelect();
      case 'checklist':
        return renderChecklist();
      case 'pass_fail':
        return renderPassFail();
      case 'photo_capture':
        return renderPhotoCapture();
      case 'auto_filled':
        return renderAutoFilled();
      case 'attendance':
        return renderAttendance();
      default:
        return renderTextInput();
    }
  };

  return <View>{renderField()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '48%',
  },
  checklistContainer: {
    gap: SPACING.sm,
  },
  checklistButton: {
    width: '100%',
  },
  autoFilledContainer: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  autoFilledValue: {
    padding: SPACING.sm,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sm,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
});
