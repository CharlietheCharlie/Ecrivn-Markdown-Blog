'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import Link from 'next/link'
import ThemeSwitch from './components/ThemeSwitch'

const NavBar = () => {
  const { status, data: session } = useSession();
  
  function filterEmail(email: string) {
    return email.split('@')[0];
  }
  
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md fixed top-0 left-0 right-0 z-10 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-gray-800 dark:text-white text-lg font-bold transition-colors duration-300">
          Next.js
        </Link>
        <div className="space-x-4 flex items-center">
          <ThemeSwitch></ThemeSwitch>
          <Link href="/users" className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition duration-200">
            Users
          </Link>
          {status === 'loading' && <div className="text-gray-400">Loading...</div>}
          {status === 'unauthenticated' && (
            <Link href="/api/auth/signin" className="text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 transition duration-200">
              Login
            </Link>
          )}
          {status === 'authenticated' && (
            <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
              <span>{session.user?.name || (session.user?.email && filterEmail(session.user?.email))}</span>
              <Link href="/api/auth/signout" className="bg-blue-500 dark:bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300">
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
