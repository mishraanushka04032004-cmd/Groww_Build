import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  loadingText: 'Syncing Market',
  startLoading: (msg) => {},
  stopLoading: () => {},
  triggerRouteLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Syncing Market');
  const [isLoading, setIsLoading] = useState(true); // Start true on boot
  const minDisplayTimeoutRef = useRef(null);
  const routeTimerRef = useRef(null);

  // Initial page boot: smooth entrance animation
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(bootTimer);
  }, []);

  // Compute composite loading state
  const shouldBeLoading = isRouteLoading || isManualLoading;

  useEffect(() => {
    if (shouldBeLoading) {
      setIsLoading(true);
      if (minDisplayTimeoutRef.current) {
        clearTimeout(minDisplayTimeoutRef.current);
        minDisplayTimeoutRef.current = null;
      }
    } else {
      // Smoothly hide after minimum display time
      minDisplayTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setLoadingText('Syncing Market');
      }, 650);
    }

    return () => {
      if (minDisplayTimeoutRef.current) clearTimeout(minDisplayTimeoutRef.current);
    };
  }, [shouldBeLoading]);

  // Called by App.jsx (inside Router) whenever path changes
  const triggerRouteLoading = useCallback(() => {
    setLoadingText('Loading Page');
    setIsRouteLoading(true);
    if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
    routeTimerRef.current = setTimeout(() => {
      setIsRouteLoading(false);
    }, 950);
  }, []);

  const startLoading = useCallback((msg = 'Syncing Market') => {
    if (msg) setLoadingText(msg);
    setIsManualLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsManualLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        startLoading,
        stopLoading,
        triggerRouteLoading,
        setGlobalLoading: setIsManualLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoader = () => useContext(LoadingContext);
