import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { t } from '@/lib/i18n';
import type { Organ } from '@/lib/plantnet';

const ORGANS: Organ[] = ['auto', 'leaf', 'flower', 'fruit', 'bark'];

type Props = {
  value: Organ;
  onChange: (next: Organ) => void;
};

export function OrganPicker({ value, onChange }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const text = useThemeColor({}, 'text');
  const onAccent = useThemeColor({ light: '#FFFFFF', dark: '#0E1411' }, 'background');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {ORGANS.map((organ) => {
        const selected = value === organ;
        return (
          <Pressable
            key={organ}
            onPress={() => onChange(organ)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? accent : surface,
                borderColor: selected ? accent : border,
              },
            ]}>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: selected ? onAccent : text, fontSize: 14 }}>
              {t(`organ.${organ}`)}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
