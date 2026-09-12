import { createI18n } from 'vue-i18n';
import {
  defaultLocale,
  messages,
  normalizeLocale,
  resolveInitialLocale,
} from './messages.js';

const browserLocale = typeof navigator === 'undefined' ? '' : navigator.language;
const storage = typeof window === 'undefined' ? null : window.localStorage;
const initialLocale = resolveInitialLocale(storage, browserLocale);

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: defaultLocale,
  messages,
});

export function setLocale(nextLocale) {
  const locale = normalizeLocale(nextLocale);
  i18n.global.locale.value = locale;
  storage?.setItem?.('sewage-locale', locale);
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
  return locale;
}

export default i18n;
