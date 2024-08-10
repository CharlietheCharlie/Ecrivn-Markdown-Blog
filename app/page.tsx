import Image from 'next/image'
import { auth } from '@/auth'
import { Metadata } from 'next'
import _ from 'lodash';
import Auth from './components/Auth';


export default function Home() {
  return (
    <>
      <Auth></Auth>
    </>
  )
}
