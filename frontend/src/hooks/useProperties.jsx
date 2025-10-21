import React from 'react'
import { useQuery } from 'react-query'
import { getAllProperties } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const useProperties = () => {
  const { token } = useAuth()

 const {data, isLoading, isError, refetch}=useQuery(
    "allProperties",
    () => getAllProperties(token),
    { 
      refetchOnWindowFocus:false
    }
 )
 return{
    data , isError, isLoading , refetch
 }
  
}

export default useProperties
