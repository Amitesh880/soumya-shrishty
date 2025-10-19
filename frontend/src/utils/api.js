import axios from "axios"
import dayjs from "dayjs"
import { toast } from "react-toastify"

export const api = axios.create({
    baseURL: "https://real-estate-backend-ipm33bce0-amitesh880s-projects.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllProperties = async (token) => {
    try {
        const response = await api.get("/residency/allresd", {
            timeout: 10 * 1000,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data.reverse()
    } catch (error) {
        toast.error("Something went wrong")
        throw error
    }
}

export const getProperty = async (id) => {
    try {
        const response = await api.get(`/residency/${id}`, {
            timeout: 10 * 1000,
        })
        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
    } catch (error) {
        toast.error("Something went wrong")
        throw error
    }
}

export const createUser = async (email, token) => {
    try{
        await api.post(`/user/register`,{email},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
    } catch (error){
        toast.error("Something went wrong,Please try again")
        throw error
    }
}

export const bookVisit = async (date, propertyId, email, token) => {
    try {
        const response = await api.post(
            `/User/bookVisit/${propertyId}`,
            {
                email,
                id: propertyId,
                date: dayjs(date).format("DD-MM-YYYY"),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("✅ API response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Booking error:", error.response?.data || error.message);
        toast.error("Something went wrong, please try again");
        throw error;
    }
};

export const removeBooking = async (id,email,token) =>{
    try{
        await api.post(`/user/removeBooking/${id}`,{email},{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    )
    } catch(error){
        toast.error("Something went wrong, please try again")
        throw error
    }
}


export const toFav = async (id,email,token) =>{
    try{
        await api.post(`/user/toFav/${id}`,{email},{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    )
    } catch(error){
        throw error
    }
}

export const getAllFav = async (email,token) =>{
    if(!token) return 
    try{
        const res = await api.post(`/user/allFav/`,{email},{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return res.data["favResidenciesID"]
    } catch(error){
        toast.error("Something went wrong while fetching fav list, please try again")
        throw error
    }
}

export const getAllBookings = async (email,token) =>{
    if(!token) return 
    try{
        const res = await api.post(`/user/allBookings/`,{email},{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return res.data["bookedVisits"]
    } catch(error){
        toast.error("Something went wrong while fetching booking list, please try again")
        throw error
    }
}

export const createResidency = async (data,token,userEmail)=>{

    const requestData = {...data,userEmail};
    console.log(requestData)

    try{
        const res = await api.post(`/residency/create`,
            requestData,
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
        )
    } catch(e) {
        toast.error("Something went wrong while creating residency")
        throw e
    }
}
