'use client';
import React, { useState } from 'react';

type NewPostProps = {
  userName: string; 
  onPostPublished: () => void; 
};

const NewPost: React.FC<NewPostProps> = ({ userName, onPostPublished }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

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
      } else {
        setTitle('');
        setContent('');
        onPostPublished();
      }
    } catch (error) {
    }
  };

  return (
    <div className="new-post-container">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      />
      <textarea
        placeholder="Write your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      />
      <button
        onClick={handlePublish}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
      >
        {isLoading ? 'Publishing...' : 'Publish'}
      </button>
    </div>
  );
};

export default NewPost;
