export const getHealthQueryOptions = () => ({
  queryKey: ['health'],
  queryFn: async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }

    return await res.json();
  },
});
