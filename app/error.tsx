'use client'
import React from 'react'
interface Props {
    error: Error;
    reset: () => void;
}
const ErrorPage = ({ error, reset }: Props) => {
    return (
        <>
            <div>An expected errro has occured.</div>
            <button className='btn btn-primary' onClick={() => reset()}>Retry</button>
        </>

    )
}

export default ErrorPage