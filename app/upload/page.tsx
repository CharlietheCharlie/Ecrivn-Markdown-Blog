'use client'
import React, { useState } from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary'

interface CloudinaryResult {
    public_id: string,

}
const UploadPage = () => {
    const [publicId, setPublicId] = useState('');
    return (
        <>
            {publicId && <CldImage src={publicId} width={270} height={180} alt='chiikawa' />}
            <CldUploadWidget
                uploadPreset='d7zcp92j'
                onUpload={(result, widget) => {
                    if (result.event !== 'success') return;
                    const info = result.info as CloudinaryResult;
                    setPublicId(info.public_id);
                }}
                options={{
                    sources: ['local'],
                    multiple: false,
                    maxFiles: 5
                }}
                >
                {({ open }) => <button onClick={() => open()} className='btn btn-primary'>Upload</button>}
            </CldUploadWidget>
        </>
    )
}

export default UploadPage