import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export type AppLang = 'fr' | 'en';

const i18n = new I18n({ en, fr });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const deviceLang = (getLocales()[0]?.languageCode ?? 'en').toLowerCase();
i18n.locale = deviceLang.startsWith('fr') ? 'fr' : 'en';

export function t(key: string, options?: object): string {
  return i18n.t(key, options);
}

export function getLang(): AppLang {
  return (i18n.locale.startsWith('fr') ? 'fr' : 'en') as AppLang;
}

export default i18n;
