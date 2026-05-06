/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrencies } from '../api/currencies';

export interface CurrencyRate {
  code: string;
  exchangeRate: number;
}

interface CurrencyContextType {
  rates: CurrencyRate[];
  loading: boolean;
  error: string | null;
  convertPrice: (price: number, fromCode: string, toCode: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  rates: [],
  loading: true,
  error: null,
  convertPrice: (price) => price,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await getCurrencies();
        // Handle response wrapping depending on backend exact output
        const data = (response as any).data || response;
        if (Array.isArray(data)) {
          setRates(data);
        } else {
          // Fallback if the backend returns the old object format
          setRates([
            { code: 'EGP', exchangeRate: (data as any).egpVsUsd || 50 },
            { code: 'EUR', exchangeRate: (data as any).eurVsUsd || 0.9 },
            { code: 'USD', exchangeRate: 1 }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        setError('Failed to fetch exchange rates');
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convertPrice = useCallback((price: number, fromCode: string, toCode: string): number => {
    if (!price || fromCode === toCode || rates.length === 0) return price;

    const fromRate = rates.find(r => r.code === fromCode)?.exchangeRate;
    const toRate = rates.find(r => r.code === toCode)?.exchangeRate;

    if (!fromRate || !toRate) return price; // Fallback if rates not found

    // Base currency is USD. 
    // Example: price in EGP (fromRate 50). Price in USD = price / 50
    // Target EUR (toRate 0.9). Price in EUR = Price in USD * 0.9
    const baseUsd = price / fromRate;
    return baseUsd * toRate;
  }, [rates]);

  return (
    <CurrencyContext.Provider value={{ rates, loading, error, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
