'use client';

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { EllipsisVerticalIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Image from "next/image";

interface Message {
    sender: string;
    message: string;
    timestamp: string; 
}

interface User {
    id: string; 
    name: string;
    image: string;
}

let socket: Socket | null = null;

export default function Chat() {
    const { data: session } = useSession();
    const [recipient, setRecipient] = useState<User | null>(null); 
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]); 
    const [message, setMessage] = useState<string>(""); 
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0); 
    const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({}); // 用來追蹤未讀訊息

    useEffect(() => {
        if (session?.user && !socket) {
            socket = io(); 
            socket.emit("join", session.user);

            socket.on("connect", () => {
                console.log("Socket connected:", socket?.id);
            });

            socket.on("newMessage", (data) => {
                if (data && data.sender && data.message) {
                    const senderId = data.sender.id;
                    
                    if (senderId === session?.user?.id) {
                        return;
                    }
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: data.sender.name, message: data.message, timestamp: data.timestamp },
                    ]);

                    setUnreadMessages((prev) => ({ ...prev, [senderId]: true }));
                } else {
                    console.error("Invalid message data received:", data);
                }
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });
        }
    }, [session]);

    const searchUsers = async (name: string): Promise<void> => {
        if (!name) return;
        const res = await fetch(`/api/users?name=${name}`);
        const data = await res.json();
        setSearchedUsers(data.users);
    };

    const joinRoom = async (recipient: { id: string; name: string; image: string }) => {
        try {
            const roomId = [session?.user?.id, recipient.id].sort().join("_");
            socket?.emit("joinRoom", roomId);

            setRecipient(recipient); 
            setUnreadMessages((prev) => ({ ...prev, [recipient.id]: false })); 

            const res = await fetch(`/api/messages/${roomId}`);
            const data = await res.json();
            setMessages(data.messages);
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    };

    const sendMessage = async () => {
        if (message.trim() && recipient) {
            try {
                const roomId = [session?.user?.id, recipient.id].sort().join("_");
                const timestamp = new Date().toISOString(); 

                socket?.emit("privateMessage", {
                    roomId,
                    sender: { id: session?.user?.id, name: session?.user?.name },
                    message,
                    timestamp, 
                });

                const res = await fetch(`/api/messages/${roomId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomId,
                        sender: session?.user?.name,
                        message,
                        timestamp, 
                    }),
                });

                if (!res.ok) throw new Error("Failed to save message");

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: session?.user?.name || "", message, timestamp },
                ]);

                setMessage("");
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

    const hasUnreadMessages = Object.values(unreadMessages).some((isUnread) => isUnread);

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
                                    <Tab
                                        className={({ selected }) =>
                                            `flex-1 p-2 ${selected ? 'border-b-2 border-blue-500' : ''}`
                                        }
                                    >
                                        Chats
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `flex-1 p-2 ${selected ? 'border-b-2 border-blue-500' : ''}`
                                        }
                                    >
                                        Search Users
                                    </Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        {recipient && <h4 className="mb-2">Chatting with: {recipient.name}</h4>}
                                        <div className="h-40 overflow-y-scroll mb-4">
                                            {messages && messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex mb-4 ${msg.sender === session?.user?.name ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs px-4 py-3 rounded-lg shadow-lg 
                    ${msg.sender === session?.user?.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                                    >
                                                        <p className="text-xs font-semibold mb-1 text-gray-500">
                                                            {msg.sender === session?.user?.name ? 'You' : msg.sender}
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
                                            onChange={(e) => searchUsers(e.target.value)}
                                        />
                                        <ul className="h-40 overflow-y-scroll">
                                            {searchedUsers && searchedUsers.map((user, idx) => (
                                                <li
                                                    key={idx}
                                                    className="cursor-pointer flex items-center p-2 mb-2 gap-1 rounded hover:bg-gray-200 relative"
                                                    onClick={() => {
                                                        joinRoom(user);
                                                        setSelectedTab(0);
                                                    }}
                                                >
                                                    {user.image && <Image src={user.image} alt={user.name} width={50} height={50} className="rounded-full h-10 w-10" />}
                                                    {!user.image && <UserCircleIcon className="h-10 w-10 text-gray-400" />}
                                                    {user.name}

                                                    {unreadMessages[user.id] && (
                                                        <span className="absolute right-0 top-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                            !
                                                        </span>
                                                    )}
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
