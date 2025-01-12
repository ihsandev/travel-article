import { useState, useEffect } from "react";

/**
 * @function useDebounce
 * @description Creates a debounced version of the given value.
 * @param {string} value The value to debounce.
 * @param {number} delay The delay time in milliseconds.
 * @returns {string} The debounced value.
 */
export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
