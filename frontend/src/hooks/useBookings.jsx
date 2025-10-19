import React , {useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAllBookings} from '../utils/api'
import UserDetailContext from '../context/UserDetailContext'
import { useContext } from 'react'

const useBookings = () => {
    const {userDetails,setUserDetails} =useContext(UserDetailContext)
    const queryRef = useRef()
    const {user } = useAuth0()

    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:"allBookings",
        queryFn:()=> getAllBookings(user?.email,userDetails.token),
        onSuccess:(data)=>setUserDetails((prev)=>({...prev,favourites:data})),
        enabled:user !== undefined,
        staletime:30000,
    })
    queryRef.current = refetch

    useEffect(()=>{
        queryRef.current && queryRef.current()
    },[userDetails?.token])

    return {data,isLoading,isError,refetch}
}
export default useBookings