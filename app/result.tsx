import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PlantResultCard } from '@/components/PlantResultCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { usePlantHistory } from '@/hooks/use-plant-history';
import { usePlantNet } from '@/hooks/use-plant-net';
import { t } from '@/lib/i18n';
import type { Organ } from '@/lib/plantnet';

function errorMessageForCode(code: string) {
  switch (code) {
    case 'INVALID_KEY':
    case 'NO_API_KEY':
      return t('result.errorInvalidKey');
    case 'QUOTA':
      return t('result.errorQuota');
    case 'NETWORK':
      return t('result.errorNetwork');
    default:
      return t('result.errorUnknown');
  }
}

export default function ResultScreen() {
  const params = useLocalSearchParams<{ photoUri: string; organ?: Organ }>();
  const photoUri = params.photoUri;
  const organ: Organ = params.organ ?? 'auto';

  const { state, run } = usePlantNet();
  const { add } = usePlantHistory();
  const [saved, setSaved] = useState(false);

  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  const danger = useThemeColor({}, 'danger');
  const onAccent = useThemeColor({ light: '#FFFFFF', dark: '#0E1411' }, 'background');

  useEffect(() => {
    if (photoUri) run(photoUri, organ);
  }, [photoUri, organ, run]);

  async function handleSave() {
    if (state.status !== 'success' || saved) return;
    await add(photoUri, organ, state.results);
    setSaved(true);
  }

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
        ) : null}

        {state.status === 'loading' || state.status === 'idle' ? (
          <View style={styles.center}>
            <ActivityIndicator color={accent} size="large" />
            <ThemedText style={[styles.muted, { color: muted }]}>
              {t('result.identifying')}
            </ThemedText>
          </View>
        ) : null}

        {state.status === 'error' ? (
          <View style={styles.errorBox}>
            <ThemedText style={{ color: danger }} type="defaultSemiBold">
              {errorMessageForCode(state.code)}
            </ThemedText>
            <Pressable
              onPress={() => run(photoUri, organ)}
              style={[styles.retry, { backgroundColor: accent }]}>
              <ThemedText type="defaultSemiBold" style={{ color: onAccent }}>
                {t('result.retry')}
              </ThemedText>
            </Pressable>
          </View>
        ) : null}

        {state.status === 'success' && state.results.length === 0 ? (
          <EmptyState message={t('result.noMatch')} />
        ) : null}

        {state.status === 'success' && state.results.length > 0 ? (
          <View style={styles.list}>
            {state.results.map((r, i) => (
              <PlantResultCard
                key={`${r.species.scientificNameWithoutAuthor}-${i}`}
                result={r}
                onPress={() =>
                  router.push({
                    pathname: '/plant/[id]',
                    params: {
                      id: r.species.scientificNameWithoutAuthor,
                      common: r.species.commonNames?.[0] ?? '',
                      family: r.species.family.scientificNameWithoutAuthor,
                    },
                  })
                }
              />
            ))}

            <Pressable
              disabled={saved}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: saved ? surface : accent,
                  borderColor: saved ? border : accent,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <ThemedText
                type="defaultSemiBold"
                style={{ color: saved ? accent : onAccent, fontSize: 16 }}>
                {saved ? t('result.saved') : t('result.save')}
              </ThemedText>
              {!saved ? <IconSymbol name="clock.fill" size={18} color={onAccent} /> : null}
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  center: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  muted: {
    fontSize: 15,
  },
  errorBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  retry: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  list: {
    gap: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
});
