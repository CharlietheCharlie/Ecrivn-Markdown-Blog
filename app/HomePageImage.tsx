'use client';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import '@/styles/highlight-js/hybrid.css';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';

const HomePageImage = () => {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const homepageText = `
    ## Hi, this is my first code share!
    
    I just wrote a simple function, 
    but hey, it’s kinda fun:
    
    \`\`\`js
    function add(a, b) {
      let result = a + b;
      console.log(result);
      return result;
    }
    add(5, 3); 
    // 8, isn't that cool? ✨
    \`\`\`
    `;

    useEffect(() => {
        const fetchData = async () => {
            const mdxSource = await serialize(homepageText, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight],
                },
            });
            setMdxSource(mdxSource);
        };
        fetchData();

        const interval = setInterval(() => {
            setIsFlipped((prev) => !prev);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`flipper-container ${isFlipped ? 'flipped' : ''}`}
            style={{ perspective: '1000px', maxWidth: '600px' }}
        >
            <div className="flipper">
                <article className="front glassmorphism">
                    <div className="markdown-content">
                    {mdxSource && <MDXRemote {...mdxSource} />}
                    </div>
                </article>

                <article className="back glassmorphism">
                    <div className="markdown-content">
                        {homepageText}
                    </div>
                </article>
            </div>

            <style jsx>{`
                .flipper-container {
                    width: 100%;
                    height: auto;
                    aspect-ratio: 7/9;
                    position: relative;
                }

                .flipper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s ease;
                }

                .flipped .flipper {
                    transform: rotateY(180deg);
                }

                .glassmorphism {
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 16px;
                    box-shadow: 
                        0 4px 6px rgba(0, 0, 0, 0.1), 
                        0 1px 3px rgba(0, 0, 0, 0.1), 
                        0 0 15px rgba(255, 255, 255, 0.3),  
                        inset 0 0 8px rgba(255, 255, 255, 0.2);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    text-align: left;
                    transition: box-shadow 0.4s ease, transform 0.4s ease;
                }

                .markdown-content {
                    width: 100%;
                    white-space: pre-wrap; 
                    word-break: break-word;
                    overflow-wrap: break-word; 
                    line-height: 1.6;
                }


                .front,
                .back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 16px;
                    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.2));
                }

                .front {
                    z-index: 2;
                    transform: rotateY(0deg);
                }

                .back {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

export default HomePageImage;
