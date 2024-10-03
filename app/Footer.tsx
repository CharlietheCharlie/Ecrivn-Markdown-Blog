import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-black dark:bg-slate-800 text-white text-center p-4 transition-colors duration-300">
            <div className="text-sm">
                &copy; {new Date().getFullYear()} Charlie W. All rights reserved.
            </div>  
        </footer>
    )
}

export default Footer