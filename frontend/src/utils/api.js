import axios from "axios"
import dayjs from "dayjs"
import { toast } from "react-toastify"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllProperties = async (token) => {
    try {
        console.log("🔍 Fetching properties from API...");
        console.log("Token available:", !!token);
        
        const headers = token ? {
            Authorization: `Bearer ${token}`,
        } : {}
        
        console.log("Request headers:", headers);
        
        const response = await api.get("/residency/allresd", {
            timeout: 10 * 1000,
            headers
        })
        
        console.log("✅ API Response received:", {
            status: response.status,
            dataLength: response.data?.length || 0,
            firstItem: response.data?.[0]?.title || "No items"
        });
        
        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        
        const reversedData = response.data.reverse();
        console.log("✅ Returning", reversedData.length, "properties");
        return reversedData;
    } catch (error) {
        console.error("❌ Error fetching properties:", error);
        console.error("Error details:", error.response?.data || error.message);
        toast.error("Something went wrong while fetching properties")
        throw error
    }
}

export const getProperty = async (id) => {
    try {
        console.log("🔍 Fetching property with ID:", id);
        
        const response = await api.get(`/residency/${id}`, {
            timeout: 10 * 1000,
        })
        
        console.log("✅ Property response received:", {
            status: response.status,
            hasData: !!response.data,
            title: response.data?.title || "No title"
        });
        
        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        
        if (!response.data) {
            throw new Error("No property data received");
        }
        
        return response.data
    } catch (error) {
        console.error("❌ Error fetching property:", error);
        console.error("Error details:", error.response?.data || error.message);
        toast.error("Failed to load property details")
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
        console.log("bookVisit API - Token received:", token);
        console.log("bookVisit API - Authorization header:", `Bearer ${token}`);
        
        const response = await api.post(
            `/user/bookVisit/${propertyId}`,
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
        console.error("Full error object:", error);
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
    console.log("Sending data to backend:", requestData);

    try{
        const res = await api.post(`/residency/create`,
            requestData,
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
        )
        console.log("Response from backend:", res.data);
        return res.data;
    } catch(e) {
        console.error("Error creating residency:", e);
        toast.error("Something went wrong while creating residency")
        throw e
    }
}
