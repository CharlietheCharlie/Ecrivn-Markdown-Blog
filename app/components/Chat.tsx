'use client';

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Image from "next/image";

interface Message {
    sender: string;
    message: string;
    timestamp: string; // 記錄發送時間的 ISO 字符串
}

interface User {
    id: string; // 使用者 ID 作為唯一識別符
    name: string;
    image: string;
}

let socket: Socket;

export default function Chat() {
    const { data: session } = useSession();
    const [recipient, setRecipient] = useState<User | null>(null); // 當前聊天對象
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]); // 搜尋結果
    const [message, setMessage] = useState<string>(""); // 訊息內容
    const [messages, setMessages] = useState<Message[]>([]); // 訊息紀錄
    const [selectedTab, setSelectedTab] = useState<number>(0); // 追蹤當前頁籤

    // 初始化 Socket 連接
    useEffect(() => {
        if (session?.user?.id && !socket) { // 檢查是否已經連接過 socket
            socket = io();
            // 加入自己的房間（用於通知）
            socket.emit("join", session.user.id);

            // 監聽訊息
            socket?.on("newMessage", (data) => {
                if (data && data.sender && data.message) {
                    if (data.sender.id === session?.user?.id) {
                        return;
                    }
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: data.sender.name, message: data.message, timestamp: data.timestamp },
                    ]);
                } else {
                    console.error("Received invalid message data:", data);
                }
            });


        }
    }, [session]);

    // 搜尋使用者 API
    const searchUsers = async (name: string): Promise<void> => {
        if (!name) return;
        const res = await fetch(`/api/users?name=${name}`);
        const data = await res.json();
        setSearchedUsers(data.users);
    };

    // 加入房間並加載歷史訊息
    const joinRoom = async (recipient: { id: string; name: string; image: string }) => {
        try {
            const roomId = [session?.user?.id, recipient.id].sort().join("_");
            socket?.emit("joinRoom", roomId); // 使用 socket 傳送 joinRoom

            setRecipient(recipient); // 設定聊天對象

            // 查詢歷史聊天紀錄
            const res = await fetch(`/api/messages/${roomId}`);
            const data = await res.json();
            setMessages(data.messages); // 加載歷史訊息
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    };

    // 發送訊息
    const sendMessage = async () => {
        if (message.trim() && recipient) {
            try {
                const roomId = [session?.user?.id, recipient.id].sort().join("_");
                const timestamp = new Date().toISOString(); // 記錄發送時間

                // 發送訊息到伺服器
                socket?.emit("privateMessage", {
                    roomId,
                    sender: { id: session?.user?.id, name: session?.user?.name },
                    message,
                    timestamp,  // 發送時間
                });

                // 將訊息儲存到伺服器端
                const res = await fetch(`/api/messages/${roomId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomId,
                        sender: session?.user?.name,
                        message,
                        timestamp, // 將時間傳遞到後端
                    }),
                });

                if (!res.ok) throw new Error("Failed to save message");

                // 將訊息更新到本地的訊息列表中
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: session?.user?.name || "", message, timestamp },
                ]);

                setMessage(""); // 清空輸入框
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };


    return (
        session &&
        <div className="fixed bottom-20 right-0 z-10">
            <Disclosure>
                {({ open }) => (
                    <>
                        {/* 只在面板關閉時顯示按鈕 */}
                        {!open && (
                            <DisclosureButton className="w-8 h-40 rounded-l-md bg-blue-500 p-2 hover:bg-blue-600 flex items-center justify-center cursor-pointer">
                                <EllipsisVerticalIcon className="w-10 H-30 text-green-400" />
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
                                        {/* 聊天紀錄頁籤 */}
                                        {recipient && <h4 className="mb-2">Chatting with: {recipient.name}</h4>}
                                        <div className="h-40 overflow-y-scroll mb-4">
                                            {messages && messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex mb-4 ${msg.sender === session?.user?.name ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs px-4 py-3 rounded-lg shadow-lg 
                    ${msg.sender === session?.user?.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}
                `}
                                                    >
                                                        {/* 發送者名字 */}
                                                        <p className="text-xs font-semibold mb-1 text-gray-500">
                                                            {msg.sender === session?.user?.name ? 'You' : msg.sender}
                                                        </p>

                                                        {/* 訊息內容 */}
                                                        <p className="text-md font-bold mb-1">
                                                            {msg.message}
                                                        </p>

                                                        {/* 發送時間 */}
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
                                        {/* 搜尋使用者頁籤 */}
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
                                                    className="cursor-pointer flex items-center p-2 mb-2 gap-1 rounded hover:bg-gray-200"
                                                    onClick={() => {
                                                        joinRoom(user);
                                                        setSelectedTab(0); // 切回聊天頁籤
                                                    }}
                                                >
                                                    <Image src={user.image} alt={user.name} width={50} height={50} className="rounded-full h-10 w-10" />
                                                    {user.name}
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
