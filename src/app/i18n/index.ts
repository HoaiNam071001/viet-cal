import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, STORAGE_KEYS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/app/config/app.config'
import en from './locales/en.json'
import vi from './locales/vi.json'

function readStoredLanguage(): AppLanguage {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.language)
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) return stored as AppLanguage
  } catch {
    /* private mode / quota — fall back to the default language */
  }
  return DEFAULT_LANGUAGE
}

void i18n
  .use(initReactI18next)
  .init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    lng: readStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEYS.language, lng)
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = lng
})
if (typeof document !== 'undefined') document.documentElement.lang = i18n.language

export default i18n
