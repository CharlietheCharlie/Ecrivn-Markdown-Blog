"use client"
import React from 'react'
import Login from './auth/Login'
import Register from './auth/Register'
const Auth = () => {
    const [isLogin, setIsLogin] = React.useState(true);

    return (
        <div className="flex flex-col items-center w-full h-full bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="w-full flex justify-center mb-4">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`p-2 w-1/2 text-white font-semibold transition duration-300 ${isLogin ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                >
                    登入
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`p-2 w-1/2 text-white font-semibold transition duration-300 ${!isLogin ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                >
                    註冊
                </button>
            </div>
            <div className="w-full p-4 bg-white rounded-lg shadow-inner">
                {isLogin ? <Login /> : <Register />}
            </div>
        </div>
    );
};

export default Auth