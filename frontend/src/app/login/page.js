import {jwtDecode} from 'jwt-decode'
import HandleAuth from './handleAuth'
import { Suspense } from 'react'
const page = async ({searchParams}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HandleAuth />
    </Suspense>
  )
}

export default page