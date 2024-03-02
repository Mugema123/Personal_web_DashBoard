import useSWR from 'swr';
import API from './_api_';

/**
 *
 * @param {string} path
 */
export const fetcher = async path => {
  return API.get(path)
    .then(res => res.data)
    .catch(error => {
      throw error.response?.data || error;
    });
};

/**
 *
 * @param {string} pathname
 */
export const useFetcher = pathname => {
  const { data, error, mutate } = useSWR(pathname, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
