import { useRef, useCallback } from 'react';

/**
 * Press-and-hold interaction for simulator buttons.
 *
 * Uses Pointer Events instead of separate mouse + touch handlers. On touch
 * devices, listening to both `onMouseDown`/`onTouchStart` makes a single tap
 * fire twice (the browser synthesises mouse events after touch), which made
 * one tap register as two Morse symbols. Pointer Events unify the two input
 * types into a single stream, so each press fires exactly once.
 *
 * It also calls `preventDefault()` and ships touch-friendly styles so a long
 * press never triggers text selection or the native callout/context menu.
 *
 * @param {() => void} onPressStart fired once when the press begins
 * @param {() => void} onPressEnd   fired once when the press ends (release,
 *                                   pointer leaving the element, or cancel)
 */
export function usePressAndHold(onPressStart, onPressEnd) {
  const pressedRef = useRef(false);

  const start = useCallback((e) => {
    if (e && e.cancelable) e.preventDefault();
    if (pressedRef.current) return;
    pressedRef.current = true;
    onPressStart();
  }, [onPressStart]);

  const end = useCallback((e) => {
    if (e && e.cancelable) e.preventDefault();
    if (!pressedRef.current) return;
    pressedRef.current = false;
    onPressEnd();
  }, [onPressEnd]);

  return {
    handlers: {
      onPointerDown: start,
      onPointerUp: end,
      onPointerLeave: end,
      onPointerCancel: end,
      onContextMenu: (e) => e.preventDefault(),
    },
    // Merge into the button's inline style so a hold never selects text.
    touchStyle: {
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none',
    },
  };
}
