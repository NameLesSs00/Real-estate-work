'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getKeyValues, KeyValue } from '@/lib/api/keyValues';

interface KeyValuesContextProps {
  keyValues: KeyValue[];
  /** Returns the value for a key, or null if it's missing or equals '#' */
  get: (key: string) => string | null;
  /** Build a WhatsApp URL from a phone number string */
  getWhatsAppUrl: (phone: string) => string;
  isLoaded: boolean;
  refetch: () => void;
}

const KeyValuesContext = createContext<KeyValuesContextProps>({
  keyValues: [],
  get: () => null,
  getWhatsAppUrl: () => '',
  isLoaded: false,
  refetch: () => {},
});

export const useKeyValues = () => useContext(KeyValuesContext);

export function KeyValuesProvider({ children }: { children: React.ReactNode }) {
  const [keyValues, setKeyValues] = useState<KeyValue[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const data = await getKeyValues();
      if (Array.isArray(data)) {
        setKeyValues(data);
      }
    } catch (err) {
      console.warn('[KeyValues] Failed to load:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const get = useCallback(
    (key: string): string | null => {
      // If not yet loaded, return null (hide everything while loading)
      if (!isLoaded && keyValues.length === 0) return null;
      const found = keyValues.find((kv) => kv.key.toLowerCase() === key.toLowerCase());
      if (!found) return null;
      const val = found.value?.trim();
      if (!val || val === '#') return null;
      return val;
    },
    [keyValues, isLoaded],
  );

  const getWhatsAppUrl = useCallback((phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }, []);

  return (
    <KeyValuesContext.Provider value={{ keyValues, get, getWhatsAppUrl, isLoaded, refetch: fetch }}>
      {children}
    </KeyValuesContext.Provider>
  );
}
