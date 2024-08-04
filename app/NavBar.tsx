'use client'
import { useSession } from 'next-auth/react';
import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  const { status, data: session } = useSession();

  return (
    <div className=' bg-slate-200 p-5 space-x-3 hidden sm:block'>
      <Link href="/" className='mr-5'>Next.js</Link>
      <Link href='/users'>Users</Link>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'unauthenticated' && <Link href='/api/auth/signin'>Login</Link>}
      {status === 'authenticated' &&
        <div>
          {session.user!.name}
          <Link href="/api/auth/signout" className='m-3'>Sign Out</Link>
        </div>}
    </div>

  )
}

export default NavBar