'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useChat } from "../hooks/useChat";
import { EllipsisVerticalIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Image from "next/image";
import debounce from 'lodash/debounce';

interface User {
    id: string;
    name: string;
    image: string;
}

export default function Chat() {
    const { data: session } = useSession();
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const { messages, recipient, joinRoom, sendMessage, unreadMessages, message, setMessage, rooms } = useChat();
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [roomId, setRoomId] = useState<string>('');
    const [currentRoomMessages, setCurrentRoomMessages] = useState<any[]>([]);

    const debouncedSearch = debounce(async (name: string) => {
        if (!name) return;
        const res = await fetch(`/api/users?name=${name}`);
        const data = await res.json();
        setSearchedUsers(data.users);
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    useEffect(() => {
        if (roomId && messages[roomId]) {
            setCurrentRoomMessages(messages[roomId]);
        }
    }, [roomId, messages]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        setHasUnreadMessages(Object.keys(unreadMessages).length > 0);
    }, [unreadMessages]);

    return (
        session &&
        <div className="fixed bottom-20 right-0 z-10">
            <Disclosure>
                {({ open }) => (
                    <>
                        {!open && (
                            <DisclosureButton className="w-8 h-40 rounded-l-md bg-blue-500 p-2 hover:bg-blue-600 flex items-center justify-center relative">
                                <EllipsisVerticalIcon className="w-6 h-6 text-white" />
                                {hasUnreadMessages && (
                                    <span className="absolute top-0 left-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2">
                                        !
                                    </span>
                                )}
                            </DisclosureButton>
                        )}

                        <DisclosurePanel className="w-80 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Chat</h3>
                                <DisclosureButton className="text-sm text-gray-600">
                                    Close
                                </DisclosureButton>
                            </div>

                            <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                                <TabList className="flex border-b mb-4">
                                    <Tab className={({ selected }) => `flex-1 p-2 ${selected ? 'border-b-2 border-blue-500' : ''}`}>
                                        Chats
                                    </Tab>
                                    <Tab className={({ selected }) => `flex-1 p-2 ${selected ? 'border-b-2 border-blue-500' : ''}`}>
                                        Search Users
                                    </Tab>
                                    <Tab className={({ selected }) => `flex-1 p-2 ${selected ? 'border-b-2 border-blue-500' : ''}`}>
                                        Rooms
                                    </Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        {recipient && <h4 className="mb-2">Chatting with: {recipient.name}</h4>}
                                        <div className="h-40 overflow-y-scroll mb-4">
                                            {currentRoomMessages?.length > 0 && currentRoomMessages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex mb-4 ${msg.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs px-4 py-3 rounded-lg shadow-lg 
                    ${msg.senderId === session?.user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                                    >
                                                        <p className="text-xs font-semibold mb-1 text-gray-500">
                                                            {msg.senderId === session?.user?.id ? 'You' : msg.senderName}
                                                        </p>

                                                        <p className="text-md font-bold mb-1">
                                                            {msg.message}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={message}
                                                className="w-full p-2 border rounded"
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") sendMessage();
                                                }}
                                            />
                                            <button
                                                className="ml-2 bg-blue-500 text-white p-2 rounded"
                                                onClick={sendMessage}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </TabPanel>

                                    <TabPanel>
                                        <input
                                            type="text"
                                            placeholder="Search users"
                                            className="w-full p-2 border rounded mb-2"
                                            onChange={handleSearchChange}
                                        />
                                        <ul className="h-40 overflow-y-scroll">
                                            {searchedUsers && searchedUsers.map((user, idx) => (
                                                <li
                                                    key={idx}
                                                    className="cursor-pointer flex items-center p-2 mb-2 gap-1 rounded hover:bg-gray-200 relative"
                                                    onClick={() => {
                                                        joinRoom(user);
                                                        setRoomId([session?.user?.id, user.id].sort().join("_"));
                                                        setSelectedTab(0);
                                                    }}
                                                >
                                                    {user.image && <Image src={user.image} alt={user.name} width={50} height={50} className="rounded-full h-10 w-10" />}
                                                    {!user.image && <UserCircleIcon className="h-10 w-10 text-gray-400" />}
                                                    {user.name}

                                                    {unreadMessages[user.id] && (
                                                        <span className="absolute top-0 left-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                            !
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </TabPanel>

                                    {/* 房間列表 */}
                                    <TabPanel>
                                        <ul className="h-40 overflow-y-scroll">
                                            {rooms && rooms.map((room, idx) => (
                                                <li
                                                    key={idx}
                                                    className="cursor-pointer flex flex-col p-2 mb-2 gap-1 rounded hover:bg-gray-200 relative"
                                                    onClick={() => {
                                                        joinRoom({ id: room.recipientId, name: room.recipientName, image: room.recipientImage });
                                                        setRoomId([session?.user?.id, room.recipientId].sort().join("_"));
                                                        setSelectedTab(0);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">{room.recipientName}</span>
                                                        {room.unreadMessages && (
                                                            <span className="bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                                !
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{room.lastMessage}</span>
                                                    <span className="text-xs text-gray-400">{new Date(room.lastMessageTimestamp).toLocaleTimeString()}</span>
                                                </li>

                                            ))}
                                        </ul>
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
        </div>
    );
}
