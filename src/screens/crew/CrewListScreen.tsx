import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchCrewMembers, setSelectedCrewMember } from '../../store/slices/adminSlice';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

export const CrewListScreen: React.FC<{ onNavigate?: (screen: string, params?: any) => void }> = ({
  onNavigate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { crew, isLoading } = useSelector((state: RootState) => state.admin);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchCrewMembers(user.companyId));
    }
  }, [user?.companyId, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.companyId) {
      await dispatch(fetchCrewMembers(user.companyId));
    }
    setRefreshing(false);
  };

  const filteredCrew = crew.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCrewMemberPress = useCallback((memberId: string) => {
    dispatch(setSelectedCrewMember(memberId));
    onNavigate?.('CrewDetail', { memberId });
  }, [dispatch, onNavigate]);

  // Memoized crew member card component
  const CrewMemberCard = React.memo(({ member }: { member: any }) => (
    <TouchableOpacity
      style={styles.crewCard}
      onPress={() => handleCrewMemberPress(member.id)}
    >
      <View style={styles.crewAvatar}>
        <Text style={[TEXT_STYLES.h3, { color: COLORS.card }]}>
          {member.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')}
        </Text>
      </View>
      <View style={styles.crewInfo}>
        <Text style={TEXT_STYLES.body16}>{member.name}</Text>
        <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>{member.role}</Text>
        {member.phoneNumber && (
          <Text style={[TEXT_STYLES.body12, { color: COLORS.textMid }]}>
            {member.phoneNumber}
          </Text>
        )}
      </View>
      <View style={styles.statusIndicator}>
        {member.isActive ? (
          <View style={styles.activeBadge}>
            <Text style={[TEXT_STYLES.body11, { color: COLORS.success }]}>Active</Text>
          </View>
        ) : (
          <View style={styles.inactiveBadge}>
            <Text style={[TEXT_STYLES.body11, { color: COLORS.textMid }]}>Inactive</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ));

  if (isLoading && crew.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {filteredCrew.length > 0 ? (
        <FlashList
          data={filteredCrew}
          renderItem={({ item }) => <CrewMemberCard member={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={TEXT_STYLES.h2}>Crew Management</Text>
                <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
                  {crew.length} member{crew.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or role..."
                  placeholderTextColor={COLORS.textMid}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View style={styles.section} />
            </>
          }
          ListFooterComponent={<View style={{ height: SPACING.xxxl }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={TEXT_STYLES.h2}>Crew Management</Text>
            <Text style={[TEXT_STYLES.body13, { color: COLORS.textMid }]}>
              {crew.length} member{crew.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or role..."
              placeholderTextColor={COLORS.textMid}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.emptyState}>
            <Text style={[TEXT_STYLES.body14, { color: COLORS.textMid }]}>
              {searchQuery ? 'No crew members found' : 'No crew members'}
            </Text>
          </View>
        </ScrollView>
      )}
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
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    paddingHorizontal: SPACING.lg,
  },
  crewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  crewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  crewInfo: {
    flex: 1,
  },
  statusIndicator: {
    alignItems: 'flex-end',
  },
  activeBadge: {
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  inactiveBadge: {
    backgroundColor: `${COLORS.border}`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  emptyState: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
