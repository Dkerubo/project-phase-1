import { useState, useEffect } from 'react'
import { i18n } from '@/lib/i18n'

export function useI18n() {
  const [locale, setLocale] = useState(i18n.getLocale())

  const changeLanguage = (newLocale: string) => {
    i18n.setLocale(newLocale)
    setLocale(newLocale)
    // Trigger a re-render by updating state
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLocale }))
  }

  const t = (key: string) => i18n.t(key)

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLocale(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  return {
    locale,
    changeLanguage,
    t,
    getLanguageName: (code: string) => i18n.getLanguageName(code),
    getLanguageFlag: (code: string) => i18n.getLanguageFlag(code)
  }
}