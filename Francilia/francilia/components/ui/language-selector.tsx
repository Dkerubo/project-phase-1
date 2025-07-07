'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { languages } from '@/lib/i18n'

export default function LanguageSelector() {
  const { locale, changeLanguage, getLanguageName, getLanguageFlag } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: string) => {
    changeLanguage(newLocale)
    setIsOpen(false)
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto bg-transparent border-0 text-white hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{getLanguageFlag(locale)} {getLanguageName(locale)}</span>
          <span className="md:hidden">{getLanguageFlag(locale)}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            className="text-white hover:bg-gray-800 focus:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}