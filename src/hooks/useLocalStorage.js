import { useState, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storage';

/**
 * Custom hook for synchronizing state with localStorage safely
 * @param {string} key 
 * @param {*} initialValue 
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return safeGet(key, initialValue);
  });

  useEffect(() => {
    safeSet(key, value);
  }, [key, value]);

  return [value, setValue];
}
