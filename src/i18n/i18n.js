import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_VI from '../locales/vi.json'
import HOME_EN from '../locales/en.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}

const resources = {
  en: { home: HOME_EN },
  vi: { home: HOME_VI }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'vi',
  fallbackLng: 'vi',
  ns: ['home'],
  defaultNS: 'home',
  interpolation: {
    escapeValue: false
  },
  debug: import.meta.env.NODE_ENV === 'development',
  react: {
    useSuspense: true
  }
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
