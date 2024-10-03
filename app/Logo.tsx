import React from 'react';
import Image from 'next/image';
import logoSvg from '../public/logo.svg'; 
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="dark:text-white fixed top-8 left-8 z-10">
      <Image
        src={logoSvg}
        width={100}
        alt="Logo"
        className="w-30 h-auto dark:invert transition-colors duration-300" 
      />
    </Link>
  );
};

export default Logo;
