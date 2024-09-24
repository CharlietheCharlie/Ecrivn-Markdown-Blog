'use client';
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon } from '@heroicons/react/24/outline';

type NewPostProps = {
  userName: string; 
};

const NewPost: React.FC<NewPostProps> = ({ userName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); 

  const handlePublish = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${userName}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
      } else {
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-post-container mb-6">
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
      >
        {isFormOpen ? (
          <>
            <ChevronUpIcon className="h-5 w-5" /> Hide New Post
          </>
        ) : (
          <>
            <PencilIcon className="h-5 w-5" /> Create New Post
            <ChevronDownIcon className="h-5 w-5" />
          </>
        )}
      </button>

      {/* 表單 */}
      {isFormOpen && (
        <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all">
          <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
          />
          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
          />
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewPost;
