import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLang, t } from '@/lib/i18n';
import type { HistoryEntry } from '@/lib/history';

type Props = {
  entry: HistoryEntry;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function HistoryItem({ entry, onPress, onLongPress }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  const accent = useThemeColor({}, 'accent');

  const date = new Date(entry.date).toLocaleDateString(
    getLang() === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' },
  );
  const score = Math.round(entry.topScore * 100);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Image source={{ uri: entry.photoPath }} style={styles.thumb} contentFit="cover" />
      <View style={styles.body}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {entry.topCommonName ?? entry.topScientificName}
        </ThemedText>
        <ThemedText style={[styles.muted, { color: muted }]} numberOfLines={1}>
          {entry.topScientificName}
        </ThemedText>
        <ThemedText style={[styles.muted, { color: muted }]} numberOfLines={1}>
          {date} · {t(`organ.${entry.organ}`)}
        </ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={{ color: accent }}>
        {score}%
      </ThemedText>
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
});
