'use client'
import React, { useEffect, useState } from 'react';
import Header from '@/app/users/Header';
import Post from '@/app/users/Post';
import Navigator from '@/app/components/Navigator';
import useInfiniteScroll from '@/app/components/useInfiniteScroll';

type Props = {
  params: {
    id: string
  }
}
type Post = {
  id: string
  content: string
}

const UserPage = ({ params: { id } }: Props) => {
  const {items, isFetching, hasMore} = useInfiniteScroll(async (currentPage) => {
    const res = await fetch(`http://localhost:3000/api/users/${id}/posts?page=${currentPage}&limit=5`);
    const posts = await res.json().then((res) => res.data);
    return posts;
  })


  return (
    <div className='pt-20'>
      <Header />
      {Array.isArray(items) && items.map((post: Post) =>
        <Post key={post.id} initialContent={post.content} postId={post.id} />)}
      <div style={{ height: '1px' }} />
      {isFetching && <div>Loading...</div>}
      {!hasMore && <div>No more posts</div>}
      <Navigator />
    </div>
  );
}

export default UserPage;
