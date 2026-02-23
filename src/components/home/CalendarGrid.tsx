import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TEXT_STYLES } from '../../theme';

interface CalendarGridProps {
  selectedDate: number | null;
  onDateSelect: (day: number | null) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysArray = () => {
    const days = [];
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const totalDays = daysInMonth(currentMonth, currentYear);

    // Empty slots for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const daysArray = useMemo(() => getDaysArray(), [currentMonth, currentYear]);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const monthYear = new Date(currentYear, currentMonth).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <Text style={[styles.monthYear, TEXT_STYLES.h4]}>{monthYear}</Text>
      </View>

      {/* Day Labels */}
      <View style={styles.daysLabels}>
        {dayLabels.map((label, index) => (
          <View key={index} style={styles.dayLabel}>
            <Text style={[styles.dayLabelText, TEXT_STYLES.label]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {daysArray.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              day === null && styles.dayButtonEmpty,
              day === selectedDate && styles.dayButtonSelected,
              day === today && day !== selectedDate && styles.dayButtonToday,
            ]}
            onPress={() => onDateSelect(day)}
            disabled={day === null}
            activeOpacity={0.7}
          >
            {day !== null && (
              <>
                <Text
                  style={[
                    styles.dayNumber,
                    day === selectedDate && styles.dayNumberSelected,
                    day === today &&
                      day !== selectedDate &&
                      styles.dayNumberToday,
                  ]}
                >
                  {day}
                </Text>
                {/* Indicator dot for days with data */}
                {day !== today && day !== selectedDate && (
                  <View style={styles.dataDot} />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.primary }]}
          />
          <Text style={[styles.legendLabel, TEXT_STYLES.body11]}>
            Selected
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F0EDE8' }]} />
          <Text style={[styles.legendLabel, TEXT_STYLES.body11]}>Today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  monthYear: {
    color: COLORS.text,
  },
  daysLabels: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: 3,
  },
  dayLabel: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabelText: {
    color: COLORS.textMid,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: SPACING.md,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  dayButtonToday: {
    backgroundColor: '#F0EDE8',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'DMSans-Bold',
  },
  dayNumberSelected: {
    color: COLORS.primary,
  },
  dayNumberToday: {
    color: COLORS.text,
  },
  dataDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 4,
  },
  legend: {
    flexDirection: 'row',
    gap: SPACING.lg,
    justifyContent: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: COLORS.textMid,
  },
});
