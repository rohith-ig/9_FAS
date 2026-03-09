"use client"
import {jwtDecode} from 'jwt-decode'
import { use, useEffect } from 'react'
import { useSearchParams,useRouter } from 'next/navigation'
const HandleAuth = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', decoded.userId);
            document.cookie = `token=${token}; path=/; max-age=1800; samesite=lax`;
            const role = decoded.role;
            if (role === 'ADMIN') {
                router.push('/admin/');
            } else if (role === 'STUDENT') {
                router.push('/user/');
            } else if (role === 'FACULTY') {
                router.push('/faculty/');
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                router.push('/login');
            }
        } else {
            return router.push('/login'); // Redirect to login if token is missing
        }
    }, []);
  
  return (
    <div>Token not found or internet slow</div>
  )
}
export default HandleAuth