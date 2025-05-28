'use client';
import { useFetchClients } from '@/hooks/fetchClients';
import { describe, expect, jest, test } from '@jest/globals';
import api from '@/utils/api';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockClients = [{ user_id: '1', username: 'client1' }];

const happyResponse = {
  data: {
    clients: mockClients,
  },
  status: 200,
  statusText: 'OK',
  headers: {},
};

const errorResponse = {
  data: {
    error: 'Network Error',
  },
  status: 400,
  statusText: 'Bad Request',
  headers: {},
};

describe('useFetchClients', () => {
  test('happy path', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce(happyResponse);

    const { result } = renderHook(() => useFetchClients());

    await act(async () => {
      await result.current.fetchClients();
    });

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.loadingClients).toBe(false);
    expect(result.current.errorClients).toBe('');
  });

  test('error path', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useFetchClients());

    await act(async () => {
      await result.current.fetchClients();
    });
    expect(result.current.loadingClients).toBe(false);
    expect(result.current.errorClients).toBe(errorResponse);
  });
});
