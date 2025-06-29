'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { languages } from '@/lib/i18n'

export default function LanguageSelector() {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const { locale, changeLanguage, getLanguageFlag } = useI18n()

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    setShowLanguageMenu(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
      >
        <Languages className="h-4 w-4" />
        <span className="text-lg">{getLanguageFlag(locale)}</span>
      </Button>
      
      {showLanguageMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowLanguageMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700 mb-2">
                Select Language
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-gray-800/50 rounded-md transition-colors ${
                    locale === language.code 
                      ? 'bg-gray-800 text-white ring-1 ring-gray-600' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {locale === language.code && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}