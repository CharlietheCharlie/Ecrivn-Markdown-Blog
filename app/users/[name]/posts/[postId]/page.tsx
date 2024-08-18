'use client'
import React, { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import '@/styles/highlight-js/hybrid.css';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { serialize } from 'next-mdx-remote/serialize';
import { useMDXComponents } from '@/mdx-components';


interface Props {
    params: {
        id: string
        postId: string
    }
}
const options = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
    },
};

export default function PostPage({ params: { id, postId } }: Props) {

    const [content, setContent] = useState<string | null>(null);
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:3000/api/users/${id}/posts/${postId}`);
            const content = await res.json();
            const mdxSource = await serialize(content, options);
            setContent(content);
            setMdxSource(mdxSource);
        }

        fetchData();
    }, [id, postId]);
    return (mdxSource && <MDXRemote {...mdxSource} components={useMDXComponents} />)
}


