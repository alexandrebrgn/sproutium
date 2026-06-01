import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import type { PlantNetResult } from '@/lib/plantnet';

type Props = {
  result: PlantNetResult;
  onPress?: () => void;
};

export function PlantResultCard({ result, onPress }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  const accent = useThemeColor({}, 'accent');

  const score = Math.round(result.score * 100);
  const common = result.species.commonNames?.[0];
  const referenceImage = result.images?.[0]?.url?.s;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.85 : 1 },
      ]}>
      {referenceImage ? (
        <Image source={{ uri: referenceImage }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, { backgroundColor: border }]} />
      )}
      <View style={styles.body}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {common ?? result.species.scientificNameWithoutAuthor}
        </ThemedText>
        <ThemedText style={[styles.muted, { color: muted }]} numberOfLines={1}>
          {result.species.scientificNameWithoutAuthor}
        </ThemedText>
        <ThemedText style={[styles.muted, { color: muted }]} numberOfLines={1}>
          {t('result.family')} · {result.species.family.scientificNameWithoutAuthor}
        </ThemedText>
        <ThemedText style={[styles.muted, { color: muted }]} numberOfLines={1}>
          {t('result.genus')} · {result.species.genus.scientificNameWithoutAuthor}
        </ThemedText>
      </View>
      <View style={styles.scoreBox}>
        <ThemedText type="defaultSemiBold" style={{ color: accent }}>
          {score}%
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  muted: {
    fontSize: 13,
    lineHeight: 18,
  },
  scoreBox: {
    minWidth: 48,
    alignItems: 'flex-end',
  },
});
