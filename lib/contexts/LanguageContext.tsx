'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../../public/locales/en.json';

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
  const [translations, setTranslations] = useState<Record<string, TranslationValue>>(enTranslations as Record<string, TranslationValue>);
  const [isReady, setIsReady] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'de', 'pl'].includes(savedLang)) {
      setLanguageState(savedLang);
      if (savedLang === 'en') {
        setIsReady(true); // English is already bundled
      }
    } else {
      setIsReady(true); // Default to English
    }
  }, []);

  useEffect(() => {
    // If it's English and we haven't fetched anything yet, we are already "ready" 
    // because we bundled it. But we fetch anyway to ensure we have the latest if updated.
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`/locales/${language}.json`);
        if (res.ok) {
          const json = await res.json();
          setTranslations(json as Record<string, TranslationValue>);
        }
      } catch {
        console.error('Failed to load translations for', language);
      } finally {
        setIsReady(true);
      }
    };
    
    // Only skip fetch if we already have English and language is English
    // but usually, it's safer to fetch to be sure.
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

  if (!isReady) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff',
        fontFamily: 'sans-serif',
        color: '#1B2134'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid #1B2134', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
            The Gate Estates
          </p>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}
