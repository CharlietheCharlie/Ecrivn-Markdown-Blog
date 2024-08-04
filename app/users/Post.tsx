'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import '@/styles/highlight-js/hybrid.css';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import useViewport from '../components/useViewport';

type Props = {
  initialContent: string;
  postId: string;
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
};

export default function Post({ initialContent, postId }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isExtend, setIsExtend] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const { viewportWidth, viewportHeight } = useViewport();
  useEffect(() => {
    const initMdx = async () => {
      const mdxSerialized = await serialize(initialContent, options);
      setMdxSource(mdxSerialized);
    };

    initMdx();
  }, [initialContent]);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExtend]);


  const handleSave = async () => {
    const mdxSerialized = await serialize(content, options);
    setMdxSource(mdxSerialized);
    setIsEditing(false);
    await fetch(`http://localhost:3000/api/users/1/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
  };

  const handlePreview = async () => {
    const mdxSerialized = await serialize(content, options);
    setMdxSource(mdxSerialized);
    setIsPreviewing(!isPreviewing);
  };

  const toggleHeight = () => {
    setIsExtend(!isExtend);
  }

  return (
    <>
      <div className='overflow-hidden transition-all duration-500'
        style={{
          maxHeight: isExtend ? `${contentHeight}px` : `${viewportHeight * 0.5}px`,
        }}
        ref={contentRef}
      >
        <div onClick={toggleHeight}
          className={`p-4 ${!isExtend && 'bg-gradient-to-b from-transparent to-slate-300'}`}
        >
          {isEditing && (
            <textarea
              className="w-full"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              rows={10}
            />
          )}
          {mdxSource && (!isEditing || isPreviewing) && <article className="prose prose-slate md:prose-lg"><MDXRemote {...mdxSource} /></article>}
          {!isEditing && <button onClick={() => setIsEditing(!isEditing)}>Edit</button>}
          {isEditing && (
            <>
              <button onClick={() => handlePreview()}>Preview</button>
              <button onClick={() => handleSave()}>Save</button>
            </>
          )}
        </div>
      </div>
      <div className='flex justify-start p-2 gap-3'>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
        </div>
      </div>
    </>
  );
}
