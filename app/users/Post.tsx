'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import '@/styles/highlight-js/hybrid.css';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronUpIcon, PencilIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import useViewport from '../hooks/useViewport';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import MarkdownHelp from '../components/MarkdownHelp';
import Image from 'next/image';
import ConfirmDialog from '../components/ConfirmDialog';

import type { TComment } from '@/types/post';

type Props = {
  isAuthor: boolean;
  userName: string;
  userImage?: string;
  id: string;
  content: string;
  createdAt: string;
  commentCount: number;
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
};

export default function Post({ isAuthor, userName, userImage, id, content: initialContent, createdAt, commentCount: initialCommentCount }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { viewportHeight } = useViewport();
  const { data: session } = useSession();

  const [content, setContent] = useState(initialContent);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtend, setIsExtend] = useState(false);
  const [comments, setComments] = useState<TComment[]>([]);
  const [newComment, setNewComment] = useState('');


  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    description: 'Are you sure you want to delete this post?',
    onConfirm: async () => {},
    onCancel: () => setConfirmDialog((prev) => ({ ...prev, isOpen: false })),
  });

  useEffect(() => {
    const initMdx = async () => {
      const mdxSerialized = await serialize(content, options);
      setMdxSource(mdxSerialized);
    };
    initMdx();
  }, [content]);

  const handleSave = async () => {
    const mdxSerialized = await serialize(content, options);
    setMdxSource(mdxSerialized);
    setIsEditing(false);

    const response = await fetch(`/api/users/${userName}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      toast.success('Post saved successfully!');
    } else {
      toast.error('Failed to save the post. Please try again.');
    }
  };

  const confirmDelete = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: true,
      onConfirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/users/${userName}/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast.success('Post deleted successfully!');
      window.location.reload();
    } else {
      toast.error('Failed to delete the post. Please try again.');
    }
  };

  const cancelEdit = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const toggleHeight = () => {
    setIsExtend(!isExtend);
  };

  const loadComments = async () => {
    if (hasLoadedComments) return;

    const response = await fetch(`/api/users/${userName}/posts/${id}/comments`);
    const data = await response.json();
    setComments(data.comments || []);
    setHasLoadedComments(true);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const newCommentData = {
      userName: session?.user?.name || 'Anonymous',
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`/api/users/${userName}/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCommentData),
    });

    if (response.ok) {
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
      setCommentCount(commentCount + 1);
      toast.success('Comment added successfully!');
    } else {
      toast.error('Failed to add the comment. Please try again.');
    }
  };

  return (
    <div className="post-container mb-8">
      <Toaster />


      <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          {!userImage && <UserIcon className="w-full h-full text-gray-400 bg-gray-200 dark:bg-gray-700 p-2" />}
          {userImage && <Image
            src={userImage}
            alt={`${userName}'s profile picture`}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />}
        </div>
        <div>
          <h3 className="font-semibold text-md text-gray-800 dark:text-white">{userName}</h3>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-700 ease-in-out bg-white dark:bg-gray-900 shadow-lg rounded-lg"
        style={{
          maxHeight: isExtend ? 'none' : `${viewportHeight * 0.5 + 100}px`,
          minHeight: `${viewportHeight * 0.3}px`,
        }}
        ref={contentRef}
      >
        {isAuthor && !isEditing && (
          <div className="flex justify-end pr-4 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 flex items-center gap-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <PencilIcon className="h-5 w-5" /> Edit
            </button>
          </div>
        )}

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
                className={`prose prose-md dark:prose-invert ${!isExtend && 'line-clamp-3 overflow-hidden'}`}
              >
                <MDXRemote {...mdxSource} />
              </article>
            )
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3 p-4 pb-4 justify-end">
            <MarkdownHelp />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Save
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              Delete
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={confirmDialog.isOpen} description={confirmDialog.description} onConfirm={confirmDialog.onConfirm} onCancel={confirmDialog.onCancel} />
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Published on: {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments ({commentCount || 0})</h3>

        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton
                onClick={loadComments}
                className="px-4 py-2 flex items-center gap-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {open ? (
                  <>
                    <ChevronUpIcon className="h-5 w-5" /> Hide Comments
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5" /> Show Comments
                  </>
                )}
              </DisclosureButton>
              <DisclosurePanel className="mt-4 h-64 overflow-y-auto p-2">
                {comments && comments.length === 0 ? (
                  <div>No comments yet</div>
                ) : (
                  comments && comments.map((comment) => (
                    <div key={comment.id} className="mb-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {comment.userName}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{comment.content}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}

                <div className="flex gap-2 mt-4">
                  <textarea
                    className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
