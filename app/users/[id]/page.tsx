'use client'
import React from 'react';
import Header from '@/app/users/Header';
import Post from '@/app/users/Post';
import Navigator from '@/app/components/Navigator';
import useInfiniteScroll from '@/app/components/useInfiniteScroll';

type Props = {
  params: {
    id: string;
  };
};
type Post = {
  id: string;
  content: string;
};

const UserPage = ({ params: { id } }: Props) => {
  const { items, isFetching, hasMore } = useInfiniteScroll(async (currentPage) => {
    const res = await fetch(`/api/users/${id}/posts?page=${currentPage}&limit=5`);
    const posts = await res.json().then((res) => res.data);
    return posts;
  });

  return (
    <div className="pt-5 px-4 max-w-3xl mx-auto">
      <Header />
      <div className="space-y-8">
        {Array.isArray(items) && items.map((post: Post) => (
          <Post key={post.id} initialContent={post.content} postId={post.id} />
        ))}
      </div>
      <div style={{ height: '1px' }} />
      {isFetching && (
        <div className="flex justify-center mt-6">
          <div className="loader"></div>
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-500 mt-6">
          No more posts
        </div>
      )}
      <Navigator />
    </div>
  );
}

export default UserPage;
