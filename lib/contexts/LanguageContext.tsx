'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'pl';

type TranslationValue = string | number | boolean | null | { [key: string]: TranslationValue } | TranslationValue[];

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => TranslationValue;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, TranslationValue>>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'de', 'pl'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`/locales/${language}.json`);
        if (res.ok) {
          const json = await res.json();
          setTranslations(json as Record<string, TranslationValue>);
        }
      } catch {
        console.error('Failed to load translations for', language);
      }
    };
    fetchTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): TranslationValue => {
    const keys = key.split('.');
    let result: TranslationValue = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && !Array.isArray(result) && k in result) {
        result = (result as Record<string, TranslationValue>)[k];
      } else {
        return key; // Fallback to key
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
