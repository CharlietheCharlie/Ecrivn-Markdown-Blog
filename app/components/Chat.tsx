'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useChat } from '../hooks/useChat';
import {
  EllipsisVerticalIcon,
  UserCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import type { TUser } from '@/types/chat';

const Chat = () => {
  const { data: session } = useSession();
  const {
    messages,
    recipient,
    joinRoom,
    sendMessage,
    message,
    setMessage,
    rooms,
    unreadMessages,
    setRecipient,
  } = useChat();

  const [searchedUsers, setSearchedUsers] = useState<TUser[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (name: string) => {
        if (!name) return;
        const res = await fetch(`/api/users?name=${name}`);
        const data = await res.json();
        setSearchedUsers(data.users);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleJoinRoom = (user: TUser) => {
    setRecipient(user);
    joinRoom(user);
    setIsChatOpen(true);
  };

  const handleBack = () => {
    setIsChatOpen(false);
    setRecipient(null);
  };

  const MemoizedMessageList = useMemo(() => (
    Array.isArray(messages) && messages.map((msg, idx) => (
      <div
        key={idx}
        className={`flex mb-4 ${msg.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs px-4 py-3 rounded-lg shadow-lg ${
            msg.senderId === session?.user?.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
          }`}
        >
          <p className="text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">
            {msg.senderId === session?.user?.id ? 'You' : msg.senderName}
          </p>
          <p className="text-md font-bold mb-1">{msg.message}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    ))
  ), [messages, session?.user?.id]);

  return (
    session && (
      <div className="fixed bottom-20 right-0 z-10">
        <Disclosure>
          {({ open }) => (
            <>
              {!open && (
                <DisclosureButton className="w-8 h-40 rounded-l-md bg-blue-500 dark:bg-blue-600 p-2 hover:bg-blue-600 flex items-center justify-center relative">
                  <EllipsisVerticalIcon className="w-6 h-6 text-white" />
                  {Object.keys(unreadMessages).length > 0 && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2">
                      !
                    </span>
                  )}
                </DisclosureButton>
              )}

              <DisclosurePanel className="w-80 h-96 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none rounded-lg flex flex-col overflow-hidden">
                {isChatOpen ? (
                  <>
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleBack}
                        className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
                      >
                        <ArrowLeftIcon className="h-5 w-5 mr-1" />
                        Back
                      </button>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Chat with {recipient?.name}
                      </h3>
                      <DisclosureButton className="text-sm text-gray-600 dark:text-gray-300">
                        Close
                      </DisclosureButton>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      {MemoizedMessageList}
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                        />
                        <button
                          className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white rounded p-2"
                          onClick={sendMessage}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Chat</h3>
                      <DisclosureButton className="text-sm text-gray-600 dark:text-gray-300">
                        Close
                      </DisclosureButton>
                    </div>

                    <TabGroup
                      selectedIndex={selectedTabIndex}
                      onChange={setSelectedTabIndex}
                      className="flex-1 flex flex-col overflow-hidden"
                    >
                      <TabList className="flex border-b border-gray-200 dark:border-gray-700">
                        <Tab className={({ selected }) =>
                          `flex-1 p-2 text-center ${selected ? 'border-b-2 border-blue-500 dark:border-blue-400' : ''}`}
                        >
                          Search Users
                        </Tab>
                        <Tab className={({ selected }) =>
                          `flex-1 p-2 text-center ${selected ? 'border-b-2 border-blue-500 dark:border-blue-400' : ''}`}
                        >
                          Rooms
                        </Tab>
                      </TabList>

                      <TabPanels className="flex-1 overflow-y-auto">
                        <TabPanel className="p-4">
                          <input
                            type="text"
                            placeholder="Search users"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                            onChange={handleSearchChange}
                          />
                          <ul>
                            {searchedUsers.map((user) => (
                              <li
                                key={user.id}
                                onClick={() => handleJoinRoom(user)}
                                className="cursor-pointer flex items-center p-2 mb-2 gap-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                                )}
                                <span>{user.name}</span>
                              </li>
                            ))}
                          </ul>
                        </TabPanel>

                        <TabPanel className="p-4">
                          <ul>
                            {rooms.map((room) => (
                              <li
                                key={room.recipientId}
                                onClick={() =>
                                  handleJoinRoom({
                                    id: room.recipientId,
                                    name: room.recipientName,
                                    image: room.recipientImage,
                                  })
                                }
                                className="cursor-pointer flex items-center p-2 mb-2 gap-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              >
                                {!room.recipientImage && <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-600" />}
                               {room.recipientImage && <Image
                                  src={room.recipientImage}
                                  alt={room.recipientName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />}
                                <span>{room.recipientName}</span>
                              </li>
                            ))}
                          </ul>
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>
                  </>
                )}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    )
  );
};

export default Chat;
