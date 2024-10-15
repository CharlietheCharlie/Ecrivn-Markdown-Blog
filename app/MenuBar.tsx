'use client';

import { useSession } from 'next-auth/react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition, Dialog } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ThemeSwitch from './components/ThemeSwitch';
import { Fragment, useEffect, useState } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Image from 'next/image';

const MenuBar = () => {
  const { status, data: session } = useSession();
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      setIsOpenLogin(false);
      setIsOpenSignup(false);
    }
  }, [session, status]);

  return (
    <>
      <Menu as="div" className="fixed right-5 top-8 z-30">
        <div>
          <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full border shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition duration-200">
            <Bars3Icon className="w-6 h-6" />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-white">
                Next.js
              </Link>
            </div>

            <div className="py-2">
              <div className="px-4 py-2">
                <ThemeSwitch />
              </div>

              {status === 'loading' && (
                <div className="px-4 py-2 text-gray-400">Loading...</div>
              )}

              {status === 'unauthenticated' && (
                <>
                  <MenuItem>
                    <button
                      onClick={() => setIsOpenLogin(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white rounded-md transition duration-200"
                    >
                      Login
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => setIsOpenSignup(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white rounded-md transition duration-200"
                    >
                      Sign up
                    </button>
                  </MenuItem>
                </>
              )}

              {status === 'authenticated' && (
                <>

                  <Link
                    href={`/users/${session.user?.name}`}
                    className="flex gap-2 items-center px-4 py-2 mt-2 text-sm text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition duration-200"
                  >
                    {session.user?.image && <Image src={session.user?.image} alt="User Image" width={30} height={30} className="rounded-full" />}
                    {session.user?.name}
                  </Link>

                  <Link
                    href="/api/auth/signout"
                    className="block px-4 py-2 mt-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-300"
                  >
                    Sign Out
                  </Link>
                </>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 mt-2"></div>

              <Link
                href="/settings"
                className="block px-4 py-2 mt-2 text-sm text-gray-700 dark:text-white hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition duration-200"
              >
                Settings
              </Link>
            </div>
          </MenuItems>
        </Transition>
      </Menu>

      <Transition appear show={isOpenLogin} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setIsOpenLogin(false)}>
          <div onClick={() => setIsOpenLogin(false)} className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
              <Login />
            </div>
          </div>
        </Dialog>
      </Transition>


      <Transition appear show={isOpenSignup} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setIsOpenSignup(false)}>
          <div onClick={() => setIsOpenSignup(false)} className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
              <Register />
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MenuBar;
