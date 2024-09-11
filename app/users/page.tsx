import React, { Suspense } from 'react'
import Link from 'next/link'

interface Props {
  searchParams: { sortOrder: string }
}
const UserPage = async ({ searchParams: { sortOrder } }: Props) => {

  return (
    <>
      <h1>Users</h1>
    </>
  )
}

export default UserPage