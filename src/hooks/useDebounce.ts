import { useState, useEffect } from 'react';
import { UI_CONFIG } from '../constants/config';

/**
 * Custom hook to debounce a value
 * 
 * Delays the update of a value until after a specified delay period.
 * Useful for search inputs, API calls, and other scenarios where you want
 * to wait for the user to stop typing/acting before performing an action.
 * 
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 500ms)
 * @returns {T} The debounced value
 * 
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *   
 *   useEffect(() => {
 *     // This will only run after user stops typing for 500ms
 *     if (debouncedSearchTerm) {
 *       performSearch(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *   
 *   return (
 *     <TextInput
 *       value={searchTerm}
 *       onChangeText={setSearchTerm}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function FilterComponent() {
 *   const [filter, setFilter] = useState('');
 *   const debouncedFilter = useDebounce(filter, 300);
 *   
 *   // API call will only trigger after 300ms of no changes
 *   useEffect(() => {
 *     fetchData(debouncedFilter);
 *   }, [debouncedFilter]);
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number = UI_CONFIG.INPUT_DEBOUNCE): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    // This ensures we only update debouncedValue after the user stops changing the value
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

