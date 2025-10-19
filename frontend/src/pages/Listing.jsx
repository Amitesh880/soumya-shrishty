import React, { useState } from 'react'
import Searchbar from '../components/Searchbar'
import useProperties from '../hooks/useProperties'
import { PuffLoader } from 'react-spinners'
import Item from '../components/Item'

const Listing = () => {
     const [filter, setFilter] = useState(''); // ← undefined by default
     const {data,isError,isLoading}=useProperties()
     if(isError) {
      return <div>
        <span>Error fetching data</span>
        </div>
        }
     if(isLoading) {
      return <div className='h-64 flex justify-center mt-24 items-center'>
        <PuffLoader height="80" width="80" radius={1} color='#555' aria-label="puff-loading" />
      </div>
     }
  return (
    <main className='my-24'>
        <div className='mx-auto  px-6 lg:px-12 py-10 bg-gradient-to-r from-yellow-400 via-yellow-200 to-white'>
            <div>
                <Searchbar filter={filter} setFilter={setFilter}/>
                <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {data.filter((property)=>
                    property.title?.toLowerCase().includes(filter.toLowerCase()) ||
                    property.city?.toLowerCase().includes(filter.toLowerCase()) ||
                    property.country?.toLowerCase().includes(filter.toLowerCase()) 
                  ).map((property)=>(
                    <Item key={property.title} property={property} />
                  ))}
                </div>
            </div>
        </div>
      
    </main>
  )
}

export default Listing
