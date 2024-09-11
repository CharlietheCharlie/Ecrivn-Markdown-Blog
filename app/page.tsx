"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const imgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { rotateY: 0 },
      {
        rotateY: 360, 
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true, 
        },
      }
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 space-y-8 md:space-y-0">
        {/* 左側程式碼圖片 */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            ref={imgRef}
            width={300} 
            height={300}
            src="/171102819298675_P29251088.jpg"
            alt="Code Image"
            className="w-80 h-80 object-cover transform perspective-1000"
          />
        </div>

        {/* 右側文字 */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to My Coding World
          </h1>
          <p className="text-lg text-gray-600">
            Explore the art of coding and technology. From the fundamentals to
            advanced techniques, dive deep into the world of programming.
          </p>
        </div>
      </div>
    </div>
  );
}
