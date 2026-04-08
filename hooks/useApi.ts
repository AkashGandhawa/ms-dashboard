'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '@/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task.moraspirit.com';

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>
  ): Promise<T> => {
    setState({ data: null, loading: true, error: null });

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method === 'POST') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json() as T;
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const error: ApiError = {
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        code: 'API_ERROR',
      };
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return { ...state, request };
}
