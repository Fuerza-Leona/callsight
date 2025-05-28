'use client';
import { useFetchAgents } from '@/hooks/fetchAgents';
import { describe, expect, jest, test } from '@jest/globals';
import api from '@/utils/api';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockAgents = [{ user_id: '1', username: 'agent1' }];

const happyResponse = {
  data: {
    data: mockAgents,
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

describe('useFetchAgents', () => {
  test('happy path', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce(happyResponse);

    const { result } = renderHook(() => useFetchAgents());

    await act(async () => {
      await result.current.fetchAgents();
    });

    expect(result.current.agents).toEqual(mockAgents);
    expect(result.current.loadingAgents).toBe(false);
    expect(result.current.errorAgents).toBe('');
  });

  test('error path', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useFetchAgents());

    await act(async () => {
      await result.current.fetchAgents();
    });
    expect(result.current.loadingAgents).toBe(false);
    expect(result.current.errorAgents).toBe(errorResponse);
  });
});
