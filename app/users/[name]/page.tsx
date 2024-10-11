'use client';

import Post from '@/app/users/Post';
import NewPost from '../NewPost';
import Navigator from '@/app/components/Navigator';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import type { TPost } from '@/types/post';

async function fetchUserPosts(name: string, page: number): Promise<TPost[]> {
  const res = await fetch(`/api/users/${name}/posts?page=${page}&limit=5`);
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const posts = await res.json();
  return posts;
}

async function fetchUserData(name: string): Promise<{ name: string } | null> {
  const res = await fetch(`/api/users/${name}`);
  if (!res.ok) {
    return null;
  }
  const userData = await res.json();
  return userData;
}

export default function UserPage({ params }: { params: { name: string } }) {
  const { data: session, status } = useSession();
  const [isAuthor, setIsAuthor] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function fetchInitialData() {
      const user = await fetchUserData(params.name);
      if (!user) {
        router.push('/');
        return;
      }
      if (status === 'authenticated' && session?.user?.name === user.name) {
        setIsAuthor(true);
      }
    }

    fetchInitialData();
  }, [params.name, session, status, router]);

  const { items: posts, isLoading, hasMore, loaderRef } = useInfiniteScroll<TPost>(
    (page) => fetchUserPosts(params.name, page),
    1,
    5
  );

  return (
    <div className="pt-5 px-4 max-w-5xl mx-auto">
      {isAuthor && <NewPost userName={params.name} />}
      <div className="space-y-10">
        {posts.map((post: TPost) => (
          <Post isAuthor={isAuthor} key={post.id} {...post} />
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
