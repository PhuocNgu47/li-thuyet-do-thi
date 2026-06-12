import { useState, useCallback } from 'react';

const RESIZE_CONFIG = {
  LEFT: { min: 250, max: 600 },
  RIGHT: { min: 250, max: 800 }
};

/**
 * Custom hook for managing resizable sidebar dimensions
 * Handles mouse events for dragging and cleanup
 */
export function useResizable() {
  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (isResizingLeft) {
      setLeftWidth(Math.max(RESIZE_CONFIG.LEFT.min, Math.min(e.clientX, RESIZE_CONFIG.LEFT.max)));
    } else if (isResizingRight) {
      setRightWidth(Math.max(RESIZE_CONFIG.RIGHT.min, Math.min(window.innerWidth - e.clientX, RESIZE_CONFIG.RIGHT.max)));
    }
  }, [isResizingLeft, isResizingRight]);

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  const updateCursorStyle = useCallback((isResizing) => {
    if (isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }, []);

  return {
    leftWidth,
    rightWidth,
    isResizingLeft,
    isResizingRight,
    setIsResizingLeft,
    setIsResizingRight,
    handleMouseMove,
    handleMouseUp,
    updateCursorStyle
  };
}
