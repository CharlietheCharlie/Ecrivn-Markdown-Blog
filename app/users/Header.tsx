import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

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

  return (
    <header className={`fixed top-0 w-full bg-white transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center bg-slate-100 h-20 p-3 gap-2">
        <Image className="rounded-full object-center h-14 w-14 bg-white" src="/logo.png" alt="logo" width={100} height={100} />
        <div className="flex flex-col">
          <h3 className='text-xl font-bold'>Name</h3>
          <p>gool</p>
        </div>
      </div>
    </header>
  )
}

export default UserHeader