'use client';
import { useEffect, useRef } from "react";
import { Merriweather } from 'next/font/google';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin"; // 引入 TextPlugin
import HomePageImage from "./HomePageImage";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const merriweather = Merriweather({ subsets: ['latin'], weight: '700' });

export default function Home() {
  const imgRef = useRef(null);
  const textRef = useRef(null); // 綁定文字的 ref
  const markdownRef = useRef(null); // 綁定 markdown 單詞的 ref
  const cursorRef = useRef(null); // 綁定 cursor 的 ref
  const buttonRef = useRef(null); // 綁定按鈕的 ref
  const tl = useRef(gsap.timeline()); // GSAP 時間線

  useEffect(() => {
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { scale: 0.8, opacity: 0, y: 50 }, 
        {
          scale: 1,
          opacity: 1,
          y: 0, 
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true, // 滾動時平滑動畫
          },
        }
      );
    }

    if (markdownRef.current && cursorRef.current) {
      gsap.fromTo(
        markdownRef.current,
        { text: "" }, 
        {
          text: "Markdown", 
          duration: 2,
          ease: "power1.inOut",
          delay: 1, 
          onComplete: () => {
            gsap.to(cursorRef.current, { opacity: 0, duration: 0.5 });
          },
        }
      );

      gsap.fromTo(
        cursorRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true, 
        }
      );
    }

    if (textRef.current) {
      tl.current
        .fromTo(
          textRef.current.querySelectorAll(".hidden-text"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5, 
            ease: "power3.out",
            stagger: 0.3, 
          }
        );
    }

    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1, 
          ease: "power3.out",
          delay: 2, 
        }
      );
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2 flex justify-center">
          <div
            ref={imgRef}
            className="relative p-7 w-96 h-100 "
            style={{ perspective: '1000px' }}
          >
            <HomePageImage />
          </div>
        </div>

        <div ref={textRef} className={`w-full md:w-1/2 text-center md:text-left ${merriweather.className}`}>
          <h1 className="hidden-text text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Welcome to Ecrivn
          </h1>
          <p className="hidden-text text-lg text-gray-600 dark:text-gray-400">
            Here, you can easily share your life experiences 
          </p>
          <p className="hidden-text text-lg text-gray-600 dark:text-gray-400">
            and work using <span ref={markdownRef}></span><span ref={cursorRef} className="cursor">|</span> format.
          </p>

          <div ref={buttonRef} className="mt-6">
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Go Explore
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor {
          display: inline-block;
          font-weight: bold;
          font-size: 1rem;
          color: #0070f3;
        }
      `}</style>
    </div>
  );
}
