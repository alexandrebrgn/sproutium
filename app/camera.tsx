import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import type { Organ } from '@/lib/plantnet';

export default function CameraScreen() {
  const params = useLocalSearchParams<{ organ?: Organ }>();
  const organ: Organ = params.organ ?? 'auto';

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const onAccent = useThemeColor({ light: '#FFFFFF', dark: '#0E1411' }, 'background');

  if (!permission) {
    return <ThemedView style={styles.flex} />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.flex}>
        <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
          <ThemedText type="subtitle" style={styles.permissionTitle}>
            {t('camera.permission')}
          </ThemedText>
          <Pressable
            onPress={requestPermission}
            style={[styles.grantBtn, { backgroundColor: accent }]}>
            <ThemedText type="defaultSemiBold" style={{ color: onAccent }}>
              {t('camera.grant')}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <ThemedText style={{ color: accent }}>{t('camera.cancel')}</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  async function snap() {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (photo?.uri) {
        router.replace({ pathname: '/result', params: { photoUri: photo.uri, organ } });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.flex}>
      <CameraView ref={cameraRef} style={styles.flex} facing={facing} />
      <SafeAreaView style={StyleSheet.absoluteFill} edges={['top', 'bottom']} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: surface }]}>
            <IconSymbol name="xmark" size={22} color={accent} />
          </Pressable>
          <Pressable
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            style={[styles.iconBtn, { backgroundColor: surface }]}>
            <IconSymbol name="arrow.clockwise" size={22} color={accent} />
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <Pressable
            disabled={busy}
            onPress={snap}
            style={({ pressed }) => [
              styles.shutter,
              { borderColor: '#FFFFFF', opacity: busy || pressed ? 0.7 : 1 },
            ]}>
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  permissionTitle: {
    textAlign: 'center',
  },
  grantBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
});
