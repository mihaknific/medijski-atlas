"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type Translations, translations } from "./translations"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("sl")
  
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  
  const t = translations[lang]
  
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
