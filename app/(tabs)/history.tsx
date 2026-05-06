import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { HistoryItem } from '@/components/HistoryItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { usePlantHistory } from '@/hooks/use-plant-history';
import { t } from '@/lib/i18n';

export default function HistoryScreen() {
  const { entries, remove, clear } = usePlantHistory();
  const danger = useThemeColor({}, 'danger');

  function confirmDelete(id: string) {
    Alert.alert(t('history.confirmDelete'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('history.delete'), style: 'destructive', onPress: () => remove(id) },
    ]);
  }

  function confirmClear() {
    Alert.alert(t('history.confirmClear'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('history.clearAll'), style: 'destructive', onPress: () => clear() },
    ]);
  }

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">{t('history.title')}</ThemedText>
          {entries.length > 0 ? (
            <Pressable onPress={confirmClear}>
              <ThemedText type="defaultSemiBold" style={{ color: danger }}>
                {t('history.clearAll')}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {entries.length === 0 ? (
          <EmptyState icon="🌿" message={t('history.empty')} />
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(e) => e.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <HistoryItem
                entry={item}
                onPress={() =>
                  router.push({
                    pathname: '/plant/[id]',
                    params: {
                      id: item.topScientificName,
                      common: item.topCommonName ?? '',
                    },
                  })
                }
                onLongPress={() => confirmDelete(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
