import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from '../api/community.api';

export function usePosts(
  params: { author_id?: string; group_id?: string; page?: number; page_size?: number } = {},
) {
  return useQuery({
    queryKey: ['community-posts', params],
    queryFn: () => fetchPosts(params),
  });
}
