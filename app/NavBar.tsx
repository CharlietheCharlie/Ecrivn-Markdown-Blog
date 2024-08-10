'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  const { status, data: session } = useSession();
  
  return (
    <nav className="bg-slate-800 p-4 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Next.js
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/users" className="text-white hover:text-gray-300 transition duration-200">
            Users
          </Link>
          {status === 'loading' && <div className="text-gray-400">Loading...</div>}
          {status === 'unauthenticated' && (
            <Link href="/api/auth/signin" className="text-blue-500 hover:text-blue-400 transition duration-200">
              Login
            </Link>
          )}
          {status === 'authenticated' && (
            <div className="flex items-center space-x-3 text-white">
              <span>{session.user?.name}</span>
              <Link href="/api/auth/signout" className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-300">
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
