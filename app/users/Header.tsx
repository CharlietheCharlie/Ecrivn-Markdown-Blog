import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

const UserHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [controlHeader]);

  const userImage = null; 

  const DefaultAvatar = () => (
    <svg
      className="rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM6.2 17.4a7 7 0 0 1 11.6 0" />
    </svg>
  );

  return (
    <header
      className={`fixed left-0 top-0 w-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="flex items-center h-16 px-6 gap-4 border-b border-gray-200 dark:border-gray-700">
        {userImage ? (
          <Image
            className="rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md"
            src={userImage}
            alt="User avatar"
            width={48}
            height={48}
          />
        ) : (
          <DefaultAvatar />
        )}
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">Username</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Subtitle or Status</p>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
