import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrganPicker } from '@/components/OrganPicker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import type { Organ } from '@/lib/plantnet';

export default function IdentifyScreen() {
  const [organ, setOrgan] = useState<Organ>('auto');
  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  const onAccent = useThemeColor({ light: '#FFFFFF', dark: '#0E1411' }, 'background');

  const apiKey = process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
  const hasKey = !!apiKey && apiKey.length > 0;

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      exif: false,
    });
    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (uri) {
      router.push({ pathname: '/result', params: { photoUri: uri, organ } });
    }
  }

  function takePhoto() {
    router.push({ pathname: '/camera', params: { organ } });
  }

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.title}>
            {t('home.title')}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: muted }]}>
            {t('home.subtitle')}
          </ThemedText>

          {!hasKey ? (
            <View style={[styles.warning, { borderColor: border, backgroundColor: surface }]}>
              <ThemedText style={{ color: muted }}>{t('home.missingApiKey')}</ThemedText>
            </View>
          ) : null}

          <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
            {t('home.selectOrgan')}
          </ThemedText>
          <OrganPicker value={organ} onChange={setOrgan} />

          <View style={styles.actions}>
            <Pressable
              onPress={() => (hasKey ? takePhoto() : Alert.alert(t('home.missingApiKey')))}
              style={({ pressed }) => [
                styles.primary,
                { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
              ]}>
              <IconSymbol name="camera.fill" size={22} color={onAccent} />
              <ThemedText
                type="defaultSemiBold"
                style={{ color: onAccent, fontSize: 17 }}>
                {t('home.takePhoto')}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() =>
                hasKey ? pickFromGallery() : Alert.alert(t('home.missingApiKey'))
              }
              style={({ pressed }) => [
                styles.secondary,
                {
                  backgroundColor: surface,
                  borderColor: border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <IconSymbol name="photo.fill" size={22} color={accent} />
              <ThemedText
                type="defaultSemiBold"
                style={{ color: accent, fontSize: 17 }}>
                {t('home.pickGallery')}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 16,
  },
  title: { marginTop: 8 },
  subtitle: { fontSize: 16, lineHeight: 22 },
  warning: {
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionLabel: { marginTop: 8, fontSize: 15 },
  actions: { marginTop: 16, gap: 12 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
