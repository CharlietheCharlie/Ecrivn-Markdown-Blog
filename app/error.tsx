'use client'
import React from 'react'
interface Props {
    error: Error;
    reset: () => void;
}
const ErrorPage = ({ error, reset }: Props) => {
    const errorMessage = error.message
    return (
        <>
            <div>Error: {errorMessage}</div>
            <button className='btn btn-primary' onClick={() => reset()}>Retry</button>
        </>

    )
}

export default ErrorPage