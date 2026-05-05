'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'pl';

type TranslationValue = string | number | boolean | null | { [key: string]: TranslationValue } | TranslationValue[];

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tRaw: (key: string) => TranslationValue;
  getLocalized: (data: string | Record<string, string> | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  tRaw: (key) => key,
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

  const tRaw = (key: string): TranslationValue => {
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

  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === 'string' ? result : key;
  };

  /**
   * getLocalized(project.name)
   * Handles objects like { en: "Name", de: "Name DE" }
   * Fallbacks: current language -> en -> any available string -> empty string
   */
  const getLocalized = (data: string | Record<string, string> | null | undefined): string => {
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
    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}
