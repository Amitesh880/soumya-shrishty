import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

export const api = axios.create({
  baseURL: "https://real-estate-backend-nine-opal.vercel.app/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Helper to get token for API calls
export const getToken = async () => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently({
      audience: "https://real-estate-backend-nine-opal.vercel.app",
    });
    return token;
  } catch (err) {
    toast.error("Authentication failed, please login again");
    throw err;
  }
};

// Properties
export const getAllProperties = async (token) => {
  try {
    const res = await api.get("/residency/allresd", {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return res.data.reverse();
  } catch (err) {
    toast.error("Failed to fetch properties");
    throw err;
  }
};

export const getProperty = async (id) => {
  try {
    const res = await api.get(`/residency/${id}`, { timeout: 10000 });
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch property details");
    throw err;
  }
};

// Users
export const createUser = async (token) => {
  try {
    await api.post("/user/register", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    toast.error("Failed to register user");
    throw err;
  }
};

export const bookVisit = async (date, propertyId, token) => {
  try {
    const res = await api.post(
      `/user/bookVisit/${propertyId}`,
      { id: propertyId, date: dayjs(date).format("DD-MM-YYYY") },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to book visit");
    throw err;
  }
};

export const removeBooking = async (id, token) => {
  try {
    await api.post(`/user/removeBooking/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    toast.error("Failed to remove booking");
    throw err;
  }
};

export const toFav = async (rid, token) => {
  try {
    await api.post(`/user/toFav/${rid}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    toast.error("Failed to update favourites");
    throw err;
  }
};

export const getAllFav = async (token) => {
  try {
    const res = await api.post("/user/allFav", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.favResidenciesID;
  } catch (err) {
    toast.error("Failed to fetch favourites");
    throw err;
  }
};

export const getAllBookings = async (token) => {
  try {
    const res = await api.post("/user/allBookings", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.bookedVisits;
  } catch (err) {
    toast.error("Failed to fetch bookings");
    throw err;
  }
};

// Residency creation
export const createResidency = async (data, token) => {
  try {
    await api.post("/residency/create", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    toast.error("Failed to create residency");
    throw err;
  }
};
