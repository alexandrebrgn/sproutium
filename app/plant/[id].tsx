import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLang, t } from '@/lib/i18n';
import { getWikipediaSummary, type WikiSummary } from '@/lib/enrichment';

export default function PlantDetailScreen() {
  const params = useLocalSearchParams<{ id: string; common?: string; family?: string }>();
  const scientificName = params.id;
  const common = params.common;
  const family = params.family;

  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const accent = useThemeColor({}, 'accent');
  const muted = useThemeColor({}, 'textMuted');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const onAccent = useThemeColor({ light: '#FFFFFF', dark: '#0E1411' }, 'background');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const wiki = await getWikipediaSummary(scientificName, getLang());
      if (!cancelled) {
        setSummary(wiki);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scientificName]);

  const heroUri = summary?.thumbnail?.source;
  const wikiUrl = summary?.content_urls?.mobile?.page;

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText type="title">{common || scientificName}</ThemedText>
          <ThemedText style={[styles.muted, { color: muted }]}>{scientificName}</ThemedText>
          {family ? (
            <ThemedText style={[styles.muted, { color: muted }]}>
              {t('result.family')} · {family}
            </ThemedText>
          ) : null}
        </View>

        {heroUri ? (
          <Image source={{ uri: heroUri }} style={styles.hero} contentFit="cover" />
        ) : null}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={accent} />
            <ThemedText style={[styles.muted, { color: muted }]}>{t('plant.loading')}</ThemedText>
          </View>
        ) : null}

        {!loading && summary ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <ThemedText style={styles.extract}>{summary.extract}</ThemedText>
          </View>
        ) : null}

        {!loading && !summary ? <EmptyState message={t('plant.notFound')} /> : null}

        {wikiUrl ? (
          <Pressable
            onPress={() => Linking.openURL(wikiUrl)}
            style={({ pressed }) => [
              styles.linkBtn,
              { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
            ]}>
            <ThemedText type="defaultSemiBold" style={{ color: onAccent }}>
              {t('plant.openWiki')}
            </ThemedText>
            <IconSymbol name="arrow.up.right.square" size={18} color={onAccent} />
          </Pressable>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  muted: {
    fontSize: 15,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 16,
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  extract: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkBtn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
});
