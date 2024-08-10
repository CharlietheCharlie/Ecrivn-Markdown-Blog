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

  // 假设 `userImage` 是你从后端或其他地方获取到的用户头像 URL
  const userImage = null; // 替换为你的实际逻辑

  const DefaultAvatar = () => (
    <svg
      className="rounded-full border-2 border-white shadow-lg"
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
      className={`fixed left-0 top-0 w-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="flex items-center h-20 px-4 gap-4">
        {userImage ? (
          <img
            className="rounded-full border-2 border-white shadow-lg"
            src={userImage}
            alt="User avatar"
            width={56}
            height={56}
          />
        ) : (
          <DefaultAvatar />
        )}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">Username</h3>
          <p className="text-sm text-gray-200">Subtitle or Status</p>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
