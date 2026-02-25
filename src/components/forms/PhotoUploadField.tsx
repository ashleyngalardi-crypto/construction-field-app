import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { Button } from '../common/Button';
import { isWeb } from '../../utils/platformDetection';

interface Photo {
  uri: string;
  name?: string;
  size?: number;
}

interface PhotoUploadFieldProps {
  label: string;
  maxPhotos?: number;
  maxFileSize?: number; // in bytes, default 1MB
  required?: boolean;
  value: Photo[];
  onChange: (photos: Photo[]) => void;
  disabled?: boolean;
  error?: string;
}

const MAX_FILE_SIZE_DEFAULT = 1024 * 1024; // 1MB
const PHOTO_THUMBNAIL_SIZE = 120;

export const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  label,
  maxPhotos = 5,
  maxFileSize = MAX_FILE_SIZE_DEFAULT,
  required = false,
  value = [],
  onChange,
  disabled = false,
  error,
}) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = value.length < maxPhotos;

  // Web: Handle file input directly
  const handleWebFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    if (!files) return;

    try {
      setLoading(true);
      const file = files[0];

      // Check file size
      if (file.size > maxFileSize) {
        Alert.alert(
          'File Too Large',
          `Photo must be smaller than ${Math.round(maxFileSize / 1024 / 1024)}MB`
        );
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const newPhoto: Photo = {
          uri: base64,
          name: file.name,
          size: file.size,
        };
        onChange([...value, newPhoto]);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing image on web:', err);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxFileSize, value, onChange]);

  const pickImageFromLibrary = useCallback(async () => {
    // On web, trigger file input
    if (isWeb) {
      fileInputRef.current?.click();
      return;
    }

    // Native implementation
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'We need camera roll permissions to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        await processImage(asset.uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image from library');
    }
  }, []);

  const takePhoto = useCallback(async () => {
    // On web, same as pick from library (no camera hardware available)
    if (isWeb) {
      pickImageFromLibrary();
      return;
    }

    // Native implementation
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        await processImage(asset.uri);
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  }, [pickImageFromLibrary]);

  const processImage = async (uri: string) => {
    try {
      setLoading(true);

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Check file size
      if (fileInfo.size && fileInfo.size > maxFileSize) {
        Alert.alert(
          'File Too Large',
          `Photo must be smaller than ${Math.round(maxFileSize / 1024 / 1024)}MB`
        );
        return;
      }

      // Extract filename
      const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;

      const newPhoto: Photo = {
        uri,
        name: filename,
        size: fileInfo.size,
      };

      onChange([...value, newPhoto]);
    } catch (err) {
      console.error('Error processing image:', err);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = useCallback(
    (index: number) => {
      const newPhotos = value.filter((_, i) => i !== index);
      onChange(newPhotos);
    },
    [value, onChange]
  );

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <View key={index} style={styles.photoContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.thumbnail}
        testID={`photo-thumbnail-${index}`}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePhoto(index)}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Remove photo ${index + 1}`}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Hidden file input for web */}
      {isWeb && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileUpload}
        />
      )}

      <View style={styles.labelContainer}>
        <Text style={[styles.label, TEXT_STYLES.label]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        <Text style={styles.count}>
          {value.length} / {maxPhotos}
        </Text>
      </View>

      {/* Photo Grid */}
      {value.length > 0 && (
        <FlatList
          data={value}
          renderItem={renderPhoto}
          keyExtractor={(_, index) => `photo-${index}`}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.photoGrid}
        />
      )}

      {/* Upload Buttons */}
      {canAddMore && !disabled && (
        <View style={styles.buttonGroup}>
          <Button
            label={isWeb ? 'Upload Photo' : 'Take Photo'}
            onPress={takePhoto}
            variant="secondary"
            size="sm"
            disabled={loading}
            style={styles.button}
            testID="take-photo-btn"
          />
          <Button
            label="Choose from Library"
            onPress={pickImageFromLibrary}
            variant="secondary"
            size="sm"
            disabled={loading}
            style={styles.button}
            testID="pick-photo-btn"
          />
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, TEXT_STYLES.body14]}>
            Processing photo...
          </Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <Text style={[styles.error, { color: COLORS.danger }]}>
          {error}
        </Text>
      )}

      {/* Empty State */}
      {value.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, TEXT_STYLES.body14, { color: COLORS.textLight }]}>
            No photos yet. Tap a button below to add photos.
          </Text>
        </View>
      )}

      {/* Max Reached Message */}
      {!canAddMore && (
        <Text style={[styles.maxReached, { color: COLORS.success }]}>
          Maximum photos reached ({maxPhotos})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontWeight: '700',
  },
  required: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  photoGrid: {
    marginBottom: SPACING.md,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: SPACING.sm,
  },
  photoContainer: {
    position: 'relative',
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  thumbnail: {
    width: PHOTO_THUMBNAIL_SIZE,
    height: PHOTO_THUMBNAIL_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  button: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  loadingText: {
    marginTop: SPACING.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
  },
  maxReached: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.sm,
  },
});
