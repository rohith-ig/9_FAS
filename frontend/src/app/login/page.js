import {jwtDecode} from 'jwt-decode'
import HandleAuth from './handleAuth'
const page = async ({searchParams}) => {
  return (
    <HandleAuth />
  )
}

export default page