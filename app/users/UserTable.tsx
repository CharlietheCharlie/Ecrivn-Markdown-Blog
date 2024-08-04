import React from 'react'
import Link from 'next/link';
import _ from 'lodash';
interface User {
    id: number;
    name: string;
    email: string;
}
interface Props {
    sortOrder: string;
}
const UserTable = async ({ sortOrder }: Props) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        cache: 'no-store'
    })
    const users: User[] = await res.json();
    const sortBy = sortOrder === 'name' ? 'name' : 'email';
    const sortedUsers = _.orderBy(users, [sortBy], ['asc']);
    return (
        <table className='table table-container'>
            <thead>
                <tr>
                    <th><Link href="/users?sortOrder=name">Name</Link></th>
                    <th><Link href="/users?sortOrder=email">Email</Link></th>
                </tr>
            </thead>
            <tbody>
                {sortedUsers.map((user) => <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                </tr>
                )}
            </tbody>

        </table>
    )
}

export default UserTable