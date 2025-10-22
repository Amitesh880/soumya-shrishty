import React , {useEffect, useRef} from 'react'
import { useAuth } from '../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAllBookings} from '../utils/api'
import UserDetailContext from '../context/UserDetailContext'
import { useContext } from 'react'

const useBookings = () => {
    const {userDetails,setUserDetails} =useContext(UserDetailContext)
    const queryRef = useRef()
    const {user } = useAuth()

    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:"allBookings",
        queryFn:()=> getAllBookings(user?.email,userDetails.token),
        onSuccess:(data)=>setUserDetails((prev)=>({...prev, bookings: data})),
        enabled: !!user,
        staleTime: 30000,
    })
    queryRef.current = refetch

    useEffect(()=>{
        queryRef.current && queryRef.current()
    },[userDetails?.token])

    return {data,isLoading,isError,refetch}
}
export default useBookings