'use client';

import Post from '@/app/users/Post';
import Navigator from '@/app/components/Navigator';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useEffect, useState } from 'react';
import type { TPost } from '@/types/post';

async function fetchRecentPosts(page: number): Promise<TPost[]> {
  const res = await fetch(`/api/posts/highlights?page=${page}&limit=5`); 
  if (!res.ok) {
    throw new Error('Failed to fetch recent posts');
  }
  const posts = await res.json();
  return posts;
}

export default function HighlightsPage() {
  const { items: posts, isLoading, hasMore, loaderRef } = useInfiniteScroll<TPost>(
    (page) => fetchRecentPosts(page),
    1,
    5
  );

  return (
    <div className="pt-5 px-4 max-w-5xl mx-auto">
      <div className="space-y-10">
        {posts.map((post: TPost) => (
          <Post isAuthor={false} key={post.id} {...post} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="mt-4 flex justify-center">
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            <span className="text-gray-500">Scroll down to load more</span>
          )}
        </div>
      )}

      {!hasMore && (
        <div className="mt-4 flex justify-center">
          <span className="text-gray-500">No more posts</span>
        </div>
      )}

      <Navigator />
    </div>
  );
}
