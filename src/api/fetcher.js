import useSWR from 'swr';
import API from './_api_';
import toast from 'react-hot-toast';

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
  const { data, error, mutate, isLoading } = useSWR(pathname, fetcher);

  const refetch = async () => {
    mutate(pathname, undefined, true);

    try {
      const newData = await fetcher(pathname);
      mutate(pathname, newData, false);
    } catch (error) {
      toast.error(String(error));
    }
  }; 

  return {
    data,
    isLoading: isLoading || (!error && !data),
    isError: error,
    isSuccess: data && !error && !isLoading,
    mutate,
    refetch,
  };
};
