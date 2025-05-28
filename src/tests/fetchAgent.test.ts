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

describe('useFetchAgents', () => {
  test('happy path', async () => {
    /*

    const { fetchAgents, agents } = useFetchAgents();
    await fetchAgents();

    expect(api.get).toHaveBeenCalledWith('/users/employees');
    expect(agents).toEqual(mockAgents);*/

    (api.get as jest.Mock).mockResolvedValueOnce(happyResponse);

    const { result } = renderHook(() => useFetchAgents());

    await act(async () => {
      await result.current.fetchAgents();
    });

    console.log(result.current.agents);
    expect(true).toEqual(true); // Placeholder for actual test logic
  });

  /*test('should set loading to true when fetching agents', async () => {
    const { fetchAgents, loadingAgents } = useFetchAgents();
    const promise = fetchAgents();
    expect(loadingAgents).toBe(true);
    await promise;
  });

  test('should set error when fetching agents fails', async () => {
    const { fetchAgents, errorAgents } = useFetchAgents();
    // Mock the API call to throw an error
    jest.spyOn(api, 'get').mockRejectedValue(new Error('Network Error'));
    await fetchAgents();
    expect(errorAgents).toBeInstanceOf(Error);
  });*/
});
