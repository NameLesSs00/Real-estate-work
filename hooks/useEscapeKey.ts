import { useEffect } from 'react';

/**
 * Hook that triggers a callback when the Escape key is pressed.
 * @param onEsc Callback function to run on Escape key press.
 * @param active Whether the listener is active.
 */
export const useEscapeKey = (onEsc: () => void, active: boolean = true) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEsc();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEsc, active]);
};
