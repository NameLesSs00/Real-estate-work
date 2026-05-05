'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'pl';

type TranslationValue = string | number | boolean | null | { [key: string]: TranslationValue } | TranslationValue[];

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string) => any;
  getLocalized: (data: any) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  getLocalized: (data) => (typeof data === 'string' ? data : ''),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (key: string): any => {
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

  /**
   * getLocalized(project.name)
   * Handles objects like { en: "Name", de: "Name DE" }
   * Fallbacks: current language -> en -> any available string -> empty string
   */
  const getLocalized = (data: any): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      const val = data[language];
      if (val && typeof val === 'string' && val.trim() !== '') {
        return val;
      }
      // Fallback to English
      const enVal = data['en'];
      if (enVal && typeof enVal === 'string' && enVal.trim() !== '') {
        return enVal;
      }
      // Fallback to any available string in the object
      const firstAvailable = Object.values(data).find(v => typeof v === 'string' && v.trim() !== '');
      return (firstAvailable as string) || '';
    }
    return String(data);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}
