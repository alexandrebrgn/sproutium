import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  icon?: string;
  title?: string;
  message: string;
};

export function EmptyState({ icon = '🌱', title, message }: Props) {
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      {title ? (
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      ) : null}
      <ThemedText style={[styles.message, { color: muted }]}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
