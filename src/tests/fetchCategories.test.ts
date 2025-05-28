'use client';
import { useFetchCategories } from '@/hooks/fetchCategories';
import { describe, expect, jest, test } from '@jest/globals';
import api from '@/utils/api';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockCategories = [{ category_id: '1', name: 'category1' }];

const happyResponse = {
  data: {
    categories: mockCategories,
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

    const { result } = renderHook(() => useFetchCategories());

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.loadingCategories).toBe(false);
    expect(result.current.errorCategories).toBe('');
  });

  test('error path', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useFetchCategories());

    await act(async () => {
      await result.current.fetchCategories();
    });
    expect(result.current.loadingCategories).toBe(false);
    expect(result.current.errorCategories).toBe(errorResponse);
  });
});
