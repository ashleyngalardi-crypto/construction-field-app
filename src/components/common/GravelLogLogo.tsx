import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface GravelLogLogoProps {
  size?: 'sm' | 'lg';
  showWordmark?: boolean;
}

export const GravelLogLogo: React.FC<GravelLogLogoProps> = ({
  size = 'lg',
  showWordmark = true,
}) => {
  const isSm = size === 'sm';
  const monoSize = isSm ? 32 : 48;
  const fontSize = isSm ? 15 : 22;
  const borderWidth = isSm ? 2.5 : 3;
  const dotSize = isSm ? 9 : 13;

  return (
    <View style={[styles.container, isSm && styles.containerSm]}>
      {/* Monogram */}
      <View
        style={[
          styles.mono,
          {
            width: monoSize,
            height: monoSize,
            borderWidth,
            borderRadius: isSm ? 9 : 13,
            borderColor: COLORS.brand,
          },
        ]}
      >
        <Text
          style={[
            styles.monoText,
            {
              fontSize,
              color: COLORS.brand,
              fontFamily: FONTS.brand,
            },
          ]}
        >
          GL
        </Text>
        {/* Corner dot */}
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: COLORS.brand,
              right: -dotSize / 2 - 2,
              bottom: -dotSize / 2 - 2,
            },
          ]}
        />
      </View>

      {/* Wordmark */}
      {showWordmark && !isSm && (
        <View style={styles.wordmark}>
          <Text
            style={[
              styles.wordmarkText,
              {
                color: COLORS.text,
                fontFamily: FONTS.brand,
              },
            ]}
          >
            GRAVEL
          </Text>
          <Text
            style={[
              styles.wordmarkText,
              {
                color: COLORS.brand,
                fontFamily: FONTS.brand,
              },
            ]}
          >
            LOG
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  containerSm: {
    gap: 8,
  },
  mono: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  monoText: {
    fontWeight: '900',
    textAlign: 'center',
  },
  dot: {
    position: 'absolute',
  },
  wordmark: {
    justifyContent: 'center',
  },
  wordmarkText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    lineHeight: 28,
  },
});
