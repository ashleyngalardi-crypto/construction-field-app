import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';
import { PhotoViewer } from '../../components/common/PhotoViewer';

interface PhotoItem {
  url: string;
  submissionId: string;
  submittedBy: string;
  templateId: string;
  completedAt: number;
  jobSiteId?: string;
}

interface GroupedPhotos {
  date: string;
  photos: PhotoItem[];
}

export const PhotosTab: React.FC = () => {
  // Redux selectors
  const formSubmissions = useSelector((state: RootState) => state.admin.formSubmissions);
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Extract photos from submissions with metadata
  const allPhotos = useMemo(() => {
    const photos: PhotoItem[] = [];

    formSubmissions.forEach((submission) => {
      if (submission.photoUrls && submission.photoUrls.length > 0) {
        submission.photoUrls.forEach((url) => {
          photos.push({
            url,
            submissionId: submission.id,
            submittedBy: submission.submittedBy,
            templateId: submission.templateId,
            completedAt: submission.completedAt,
            jobSiteId: submission.jobSiteId,
          });
        });
      }
    });

    return photos;
  }, [formSubmissions]);

  // Filter photos by date range
  const filteredPhotos = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    return allPhotos.filter((photo) => {
      const photoAge = now - photo.completedAt;

      switch (selectedFilter) {
        case 'today':
          return photoAge < oneDay;
        case 'week':
          return photoAge < sevenDays;
        case 'month':
          return photoAge < thirtyDays;
        case 'all':
        default:
          return true;
      }
    });
  }, [allPhotos, selectedFilter]);

  // Group photos by date
  const groupedPhotos = useMemo(() => {
    const groups: { [key: string]: PhotoItem[] } = {};

    filteredPhotos.forEach((photo) => {
      const date = new Date(photo.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(photo);
    });

    // Sort by date (newest first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, photos]) => ({ date, photos }));
  }, [filteredPhotos]);

  // Calculate statistics
  const stats = useMemo(
    () => ({
      totalPhotos: allPhotos.length,
      todayPhotos: allPhotos.filter((p) => {
        const photoAge = Date.now() - p.completedAt;
        return photoAge < 24 * 60 * 60 * 1000;
      }).length,
      filteredPhotos: filteredPhotos.length,
    }),
    [allPhotos, filteredPhotos]
  );

  const handlePhotoPress = useCallback(
    (photo: PhotoItem) => {
      const photoIndex = filteredPhotos.findIndex((p) => p.url === photo.url);
      setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
      setViewerVisible(true);
    },
    [filteredPhotos]
  );

  const renderPhotoGrid = (photos: PhotoItem[]) => {
    const photoWidth = Dimensions.get('window').width / 3 - SPACING.sm;

    return (
      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={`${photo.submissionId}-${index}`}
            style={[styles.photoItem, { width: photoWidth, height: photoWidth }]}
            onPress={() => handlePhotoPress(photo)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: photo.url }}
              style={styles.photoImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, TEXT_STYLES.body14]}>
            Loading photos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, TEXT_STYLES.h2]}>Photos</Text>
          <Text style={[styles.subtitle, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
            Gallery of submitted photos
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalPhotos}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Total Photos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.todayPhotos}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.filteredPhotos}</Text>
            <Text style={[styles.statLabel, TEXT_STYLES.body12]}>Showing</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'today', 'week', 'month'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  TEXT_STYLES.body12,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter === 'all' ? 'All' : filter === 'today' ? 'Today' : filter === 'week' ? '7 Days' : '30 Days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photos Section */}
        {filteredPhotos.length > 0 ? (
          <View>
            {groupedPhotos.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.dateGroup}>
                <Text style={[styles.dateHeader, TEXT_STYLES.label]}>
                  {group.date}
                </Text>
                {renderPhotoGrid(group.photos)}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={[styles.emptyTitle, TEXT_STYLES.body14]}>
              No photos yet
            </Text>
            <Text style={[styles.emptySubtitle, TEXT_STYLES.body12, { color: COLORS.textLight }]}>
              Photos from form submissions will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Photo Viewer Modal */}
      <PhotoViewer
        visible={viewerVisible}
        photoUrl={filteredPhotos[selectedPhotoIndex]?.url || ''}
        metadata={{
          submittedBy: filteredPhotos[selectedPhotoIndex]?.submittedBy,
          completedAt: filteredPhotos[selectedPhotoIndex]?.completedAt,
          jobSiteName: filteredPhotos[selectedPhotoIndex]?.jobSiteId,
        }}
        allPhotos={filteredPhotos.map((photo) => ({
          url: photo.url,
          metadata: {
            submittedBy: photo.submittedBy,
            completedAt: photo.completedAt,
            jobSiteName: photo.jobSiteId,
          },
        }))}
        onClose={() => setViewerVisible(false)}
        onNavigate={setSelectedPhotoIndex}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  dateGroup: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  dateHeader: {
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  photoItem: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    color: COLORS.textLight,
  },
});
