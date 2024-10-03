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
    console.log(\`\${a} + \${b} = \${result},
    isn't that cool? ✨\`);
    return result;
    }
    add(5, 3); 
    // 5 + 3 = 8, isn't that cool? ✨
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
            className={`w-full h-full relative ${isFlipped ? 'flipped' : ''}`}
            style={{
                perspective: '1000px',
                maxWidth: '600px',
                height: 'auto',
                aspectRatio: '7/9',
            }}
        >
            <div className="flipper">
                <article className="front prose prose-sm dark:prose-invert bg-white bg-opacity-30  p-5 rounded-lg">
                    {mdxSource && <MDXRemote {...mdxSource} />}
                </article>

                <article className="back prose prose-sm dark:prose-invert bg-white bg-opacity-30 overflow-hidden  rounded-lg">
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {homepageText}
                    </div>
                </article>
            </div>

            <style jsx>{`
                .flipper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: 0.6s;
                }
                
                

                .flipped .flipper {
                    transform: rotateY(180deg);
                }

                .front,
                .back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.2));
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5),    
                    0 0 30px rgba(255, 255, 255, 0.3), 
                    0 0 45px rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
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
