import {Button,Group} from '@mantine/core'
import React, {useEffect, useRef, useState} from 'react'
import {MdOutlineCloudUpload} from 'react-icons/md'

const UploadImage = ({prevStep,nextStep,propertyDetails,setPropertyDetails})=>{
    const [imageURL,setImageURL] = useState(propertyDetails.image)
    const cloudinaryRef = useRef()
    const widgeRef = useRef()

    const handleNext =()=>{
        setPropertyDetails((prev)=>({...prev,image:imageURL}))
        nextStep()
    }

    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary
        widgeRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dmkrkwezy",
            uploadPreset:"gsfdydfgh"
        },(err,result)=>{
            if(result.event === "success"){
                setImageURL(result.info.secure_url)
            }
        }
    )
    },[])

    return (
        <div className='mt-12 flex justify-center flex-col'>
            {!imageURL?(
                <div onClick={()=>widgeRef.current?.open()} className='flex justify-center flex-col w-3/4 h-[21rem] border-dashed border-2 cursor-pointer'>
                    <MdOutlineCloudUpload size={44} color='grey'/>
                    <span>Upload Image</span>
                </div>
            ):(
                <div onClick={()=>widgeRef.current?.open()} className=' flex justify-center w-3/4 h-[22rem] rounded-xl overflow-hidden border-dashed border-2 cursor-pointer'>
                    <img src={imageURL} alt="" className='h-full w-full object-cover' />
                </div>
            )}
            <Group justify='center' mt={'xl'} >
                <Button onClick={prevStep}>Go Back</Button>
                <Button onClick={handleNext} disabled={!imageURL}>Next</Button>
            </Group>
        </div>
    )
}
export default UploadImage