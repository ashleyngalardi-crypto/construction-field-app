import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Share,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface PhotoViewerProps {
  visible: boolean;
  photoUrl: string;
  metadata?: {
    submittedBy?: string;
    templateName?: string;
    completedAt?: number;
    jobSiteName?: string;
    formType?: string;
  };
  allPhotos?: Array<{
    url: string;
    metadata?: {
      submittedBy?: string;
      templateName?: string;
      completedAt?: number;
      jobSiteName?: string;
      formType?: string;
    };
  }>;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  visible,
  photoUrl,
  metadata,
  allPhotos,
  onClose,
  onNavigate,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPhoto = useMemo(() => {
    if (allPhotos && allPhotos.length > 0) {
      return allPhotos[currentIndex];
    }
    return { url: photoUrl, metadata };
  }, [allPhotos, currentIndex, photoUrl, metadata]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load image');
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        url: currentPhoto.url,
        title: 'Photo',
        message: `Photo submitted by ${currentPhoto.metadata?.submittedBy || 'Unknown'}`,
      });
    } catch (error) {
      console.error('Error sharing photo:', error);
    }
  }, [currentPhoto]);

  const handleNextPhoto = useCallback(() => {
    if (allPhotos && currentIndex < allPhotos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setIsLoading(true);
      onNavigate?.(nextIndex);
    }
  }, [allPhotos, currentIndex, onNavigate]);

  const handlePreviousPhoto = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setIsLoading(true);
      onNavigate?.(prevIndex);
    }
  }, [currentIndex, onNavigate]);

  const formatDate = useCallback((timestamp: number | undefined) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const windowHeight = Dimensions.get('window').height;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, TEXT_STYLES.h3]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, TEXT_STYLES.body14]}>
            {allPhotos ? `${currentIndex + 1} of ${allPhotos.length}` : 'Photo'}
          </Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={[styles.shareText, TEXT_STYLES.h3]}>⤴</Text>
          </TouchableOpacity>
        </View>

        {/* Image Display */}
        <View style={[styles.imageContainer, { height: windowHeight * 0.55 }]}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          <Image
            source={{ uri: currentPhoto.url }}
            style={styles.image}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="contain"
          />
        </View>

        {/* Navigation Arrows */}
        {allPhotos && allPhotos.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePreviousPhoto}
              disabled={currentIndex === 0}
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            >
              <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>
                ‹ Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextPhoto}
              disabled={currentIndex === allPhotos.length - 1}
              style={[styles.navButton, currentIndex === allPhotos.length - 1 && styles.navButtonDisabled]}
            >
              <Text style={[styles.navButtonText, currentIndex === allPhotos.length - 1 && styles.navButtonTextDisabled]}>
                Next ›
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Metadata */}
        <ScrollView style={styles.metadataContainer} contentContainerStyle={styles.metadataContent}>
          {currentPhoto.metadata && (
            <>
              {currentPhoto.metadata.formType && (
                <View style={styles.metadataRow}>
                  <Text style={[styles.metadataLabel, TEXT_STYLES.body12]}>Form Type</Text>
                  <Text style={[styles.metadataValue, TEXT_STYLES.body14]}>
                    {currentPhoto.metadata.formType}
                  </Text>
                </View>
              )}

              {currentPhoto.metadata.jobSiteName && (
                <View style={styles.metadataRow}>
                  <Text style={[styles.metadataLabel, TEXT_STYLES.body12]}>Job Site</Text>
                  <Text style={[styles.metadataValue, TEXT_STYLES.body14]}>
                    {currentPhoto.metadata.jobSiteName}
                  </Text>
                </View>
              )}

              {currentPhoto.metadata.submittedBy && (
                <View style={styles.metadataRow}>
                  <Text style={[styles.metadataLabel, TEXT_STYLES.body12]}>Submitted By</Text>
                  <Text style={[styles.metadataValue, TEXT_STYLES.body14]}>
                    {currentPhoto.metadata.submittedBy}
                  </Text>
                </View>
              )}

              {currentPhoto.metadata.completedAt && (
                <View style={styles.metadataRow}>
                  <Text style={[styles.metadataLabel, TEXT_STYLES.body12]}>Date & Time</Text>
                  <Text style={[styles.metadataValue, TEXT_STYLES.body14]}>
                    {formatDate(currentPhoto.metadata.completedAt)}
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.closeButtonFull]}>
            <Text style={[styles.buttonText, TEXT_STYLES.body14]}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.button, styles.shareButtonFull]}>
            <Text style={[styles.buttonText, styles.shareButtonText, TEXT_STYLES.body14]}>
              Share Photo
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
  closeButton: {
    padding: SPACING.sm,
  },
  closeText: {
    color: COLORS.text,
    fontSize: 20,
  },
  headerTitle: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  shareButton: {
    padding: SPACING.sm,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 20,
  },
  imageContainer: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: COLORS.textLight,
  },
  metadataContainer: {
    flex: 1,
  },
  metadataContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metadataLabel: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  metadataValue: {
    color: COLORS.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonFull: {
    backgroundColor: COLORS.border,
  },
  shareButtonFull: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  shareButtonText: {
    color: '#FFFFFF',
  },
});
