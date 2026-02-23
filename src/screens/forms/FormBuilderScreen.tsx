import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createFormTemplate } from '../../store/slices/adminSlice';
import { Button } from '../../components/common/Button';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea';
  label: string;
  required: boolean;
}

const FORM_TEMPLATES = [
  { type: 'risk' as const, name: 'Risk Assessment', icon: '⚠️' },
  { type: 'equipment' as const, name: 'Equipment Inspection', icon: '🔧' },
  { type: 'toolbox' as const, name: 'Toolbox Talk', icon: '💬' },
  { type: 'custom' as const, name: 'Custom Form', icon: '📋' },
];

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'per_shift', label: 'Per Shift' },
  { id: 'as_needed', label: 'As Needed' },
];

const VISIBILITY_OPTIONS = [
  { id: 'crew', label: 'Crew Only' },
  { id: 'admin_only', label: 'Admin Only' },
];

const FIELD_TYPES = [
  { id: 'text', label: 'Text Input' },
  { id: 'number', label: 'Number' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'select', label: 'Dropdown' },
  { id: 'textarea', label: 'Long Text' },
];

export const FormBuilderScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({
  onNavigate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { isLoading } = useSelector((state: RootState) => state.admin);

  const [formName, setFormName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'risk' | 'equipment' | 'toolbox' | 'custom'>(
    'custom'
  );
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'per_shift' | 'as_needed'>('daily');
  const [visibility, setVisibility] = useState<'crew' | 'admin_only'>('crew');
  const [isRequired, setIsRequired] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showFieldTypeModal, setShowFieldTypeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `Field ${fields.length + 1}`,
      required: false,
    };
    setFields([...fields, newField]);
    setShowFieldTypeModal(false);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleCreateForm = async () => {
    if (!formName.trim() || !user?.companyId) {
      alert('Please enter a form name');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        name: formName,
        icon: FORM_TEMPLATES.find((t) => t.type === selectedTemplate)?.icon || '📋',
        templateType: selectedTemplate,
        frequency,
        required: isRequired,
        visibility,
        fields: fields.map((f) => ({
          id: f.id,
          type: f.type,
          label: f.label,
          required: f.required,
        })),
        isActive: true,
        createdBy: user.id,
      };

      await dispatch(
        createFormTemplate({
          companyId: user.companyId,
          templateData: formData as any,
        })
      );

      setFormName('');
      setSelectedTemplate('custom');
      setFrequency('daily');
      setVisibility('crew');
      setIsRequired(false);
      setFields([]);
      alert('Form template created successfully!');
      onNavigate?.('Home');
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Failed to create form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTemplateObj = FORM_TEMPLATES.find((t) => t.type === selectedTemplate);
  const frequencyObj = FREQUENCY_OPTIONS.find((f) => f.id === frequency);
  const visibilityObj = VISIBILITY_OPTIONS.find((v) => v.id === visibility);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={TEXT_STYLES.h2}>Build Form</Text>
          <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
            Create custom form templates
          </Text>
        </View>

        {/* Form Name */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label}>Form Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Daily Safety Check"
            placeholderTextColor={COLORS.textMid}
            value={formName}
            onChangeText={setFormName}
            editable={!isSubmitting}
          />
        </View>

        {/* Template Type */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label}>Template Type</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowTemplateModal(true)}
            disabled={isSubmitting}
          >
            <Text style={TEXT_STYLES.h3}>{selectedTemplateObj?.icon}</Text>
            <View style={{ marginLeft: SPACING.md, flex: 1 }}>
              <Text style={TEXT_STYLES.body14}>{selectedTemplateObj?.name}</Text>
            </View>
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label}>Frequency</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowFrequencyModal(true)}
            disabled={isSubmitting}
          >
            <Text style={TEXT_STYLES.body14}>{frequencyObj?.label}</Text>
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid, marginLeft: 'auto' }]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Visibility */}
        <View style={styles.section}>
          <Text style={TEXT_STYLES.label}>Visibility</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowVisibilityModal(true)}
            disabled={isSubmitting}
          >
            <Text style={TEXT_STYLES.body14}>{visibilityObj?.label}</Text>
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid, marginLeft: 'auto' }]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Required Toggle */}
        <View style={styles.section}>
          <View style={styles.requiredHeader}>
            <Text style={TEXT_STYLES.label}>Required</Text>
            <Switch
              value={isRequired}
              onValueChange={setIsRequired}
              disabled={isSubmitting}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={isRequired ? COLORS.primary : COLORS.textLight}
            />
          </View>
          <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
            {isRequired ? 'This form is required for all crew' : 'This form is optional'}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <View style={styles.fieldsHeader}>
            <Text style={TEXT_STYLES.h3}>Form Fields {fields.length > 0 && `(${fields.length})`}</Text>
            <TouchableOpacity
              style={styles.addFieldButton}
              onPress={() => setShowFieldTypeModal(true)}
              disabled={isSubmitting}
            >
              <Text style={[TEXT_STYLES.body14, { color: COLORS.primary }]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {fields.length > 0 ? (
            <FlatList
              data={fields}
              renderItem={({ item, index }) => (
                <View key={item.id} style={styles.fieldCard}>
                  <View style={styles.fieldHeader}>
                    <Text style={TEXT_STYLES.body12}>{index + 1}. Field</Text>
                    <TouchableOpacity onPress={() => handleRemoveField(item.id)}>
                      <Text style={[TEXT_STYLES.body14, { color: COLORS.danger }]}>Remove</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Field label"
                    placeholderTextColor={COLORS.textMid}
                    value={item.label}
                    onChangeText={(text) => handleUpdateField(item.id, { label: text })}
                    editable={!isSubmitting}
                  />

                  <View style={styles.fieldTypeRow}>
                    <Text style={[TEXT_STYLES.body12, { color: COLORS.textMid }]}>
                      Type: {item.type}
                    </Text>
                    <View style={styles.fieldRequiredToggle}>
                      <Text style={TEXT_STYLES.body12}>Required</Text>
                      <Switch
                        value={item.required}
                        onValueChange={(checked) => handleUpdateField(item.id, { required: checked })}
                        disabled={isSubmitting}
                        trackColor={{ false: COLORS.border, true: `${COLORS.success}50` }}
                        thumbColor={item.required ? COLORS.success : COLORS.textLight}
                      />
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: SPACING.md }} />}
            />
          ) : (
            <View style={styles.emptyFields}>
              <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>
                No fields added yet. Tap "Add" to create fields.
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.actionSection}>
          <Button
            label={isSubmitting ? 'Creating...' : 'Create Form Template'}
            variant="admin"
            onPress={handleCreateForm}
            loading={isSubmitting}
            disabled={isSubmitting || !formName.trim()}
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={() => onNavigate?.('Home')}
            disabled={isSubmitting}
          />
        </View>

        <View style={{ height: SPACING.lg }} />
      </ScrollView>

      {/* Template Modal */}
      <Modal
        visible={showTemplateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Select Template</Text>
            {FORM_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.type}
                style={[
                  styles.modalOption,
                  selectedTemplate === template.type && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setSelectedTemplate(template.type);
                  setShowTemplateModal(false);
                }}
              >
                <Text style={TEXT_STYLES.h3}>{template.icon}</Text>
                <Text style={[TEXT_STYLES.body14, { marginLeft: SPACING.md }]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Frequency Modal */}
      <Modal
        visible={showFrequencyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFrequencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Select Frequency</Text>
            {FREQUENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOption,
                  frequency === option.id && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setFrequency(option.id as any);
                  setShowFrequencyModal(false);
                }}
              >
                <Text style={TEXT_STYLES.body14}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Visibility Modal */}
      <Modal
        visible={showVisibilityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVisibilityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Select Visibility</Text>
            {VISIBILITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOption,
                  visibility === option.id && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setVisibility(option.id as any);
                  setShowVisibilityModal(false);
                }}
              >
                <Text style={TEXT_STYLES.body14}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Field Type Modal */}
      <Modal
        visible={showFieldTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFieldTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TEXT_STYLES.h3}>Add Field Type</Text>
            {FIELD_TYPES.map((fieldType) => (
              <TouchableOpacity
                key={fieldType.id}
                style={styles.modalOption}
                onPress={() => handleAddField(fieldType.id as any)}
              >
                <Text style={TEXT_STYLES.body14}>{fieldType.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  selectorButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  requiredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  fieldsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addFieldButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  fieldCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  fieldInput: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    color: COLORS.text,
    fontSize: 13,
    marginBottom: SPACING.sm,
  },
  fieldTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldRequiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyFields: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  actionSection: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    width: '85%',
    maxHeight: '70%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: `${COLORS.admin}10`,
  },
});
