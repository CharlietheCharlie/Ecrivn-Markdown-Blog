'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import '@/styles/highlight-js/hybrid.css'; 
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import useViewport from '../hooks/useViewport';
import { useSession } from 'next-auth/react';

type Props = {
  initialContent: string;
  userName: string;
  postId: string;
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
};

export default function Post({ initialContent, userName, postId }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { viewportHeight } = useViewport();
  const { data: session } = useSession();

  const [content, setContent] = useState(initialContent);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtend, setIsExtend] = useState(false);

  useEffect(() => {
    const initMdx = async () => {
      const mdxSerialized = await serialize(initialContent, options);
      setMdxSource(mdxSerialized);
    };
    initMdx();
  }, [initialContent]);

  const handleSave = async () => {
    const mdxSerialized = await serialize(content, options);
    setMdxSource(mdxSerialized);
    setIsEditing(false);

    await fetch(`/api/users/${userName}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
  };

  const cancelEdit = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const toggleHeight = () => {
    setIsExtend(!isExtend);
  };

  const isAuthorized = session?.user?.name === userName;

  return (
    <div className="post-container mb-8">
      <div
        className="overflow-hidden transition-all duration-700 ease-in-out bg-white dark:bg-gray-900 shadow-md rounded-lg"
        style={{
          maxHeight: isExtend ? 'none' : `${viewportHeight * 0.5}px`,
          minHeight: `${viewportHeight * 0.3}px`,
        }}
        ref={contentRef}
      >
        <div onClick={toggleHeight} className="p-6 cursor-pointer">
          {isEditing ? (
            <textarea
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              rows={10}
            />
          ) : (
            mdxSource && (
              <article
                className={`prose prose-sm sm:prose lg:prose xl:prose-xl dark:prose-invert ${!isExtend && 'line-clamp-3 overflow-hidden'}`}
              >
                <MDXRemote {...mdxSource} />
              </article>
            )
          )}
        </div>
      </div>

      {isAuthorized && (
        <div className="mt-4 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 text-sm"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
