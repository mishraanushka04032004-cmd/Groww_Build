import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient.js';
import { LoadingProvider } from '../context/LoadingContext.jsx';
import { AuthProvider } from '../features/auth/context/AuthContext.jsx';

export const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
};
