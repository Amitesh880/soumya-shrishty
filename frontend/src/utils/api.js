import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "https://real-estate-backend-nine-opal.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Properties
export const getAllProperties = async (token) => {
  try {
    const res = await api.get("/residency/allresd", {
      timeout: 10000,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.reverse();
  } catch (error) {
    toast.error("Failed to load properties");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const res = await api.get(`/residency/${id}`, { timeout: 10000 });
    return res.data;
  } catch (error) {
    toast.error("Failed to load property details");
    throw error;
  }
};

// 🟢 Users
export const createUser = async (email) => {
  try {
    await api.post("/user/register", { email });
  } catch (error) {
    toast.error("User registration failed");
    throw error;
  }
};

// 🟢 Book Visit
export const bookVisit = async (date, propertyId, token) => {
  try {
    const res = await api.post(
      `/user/bookVisit/${propertyId}`,
      { date: dayjs(date).format("DD-MM-YYYY") },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Booking response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Booking error:", error.response?.data || error.message);
    toast.error("Booking failed");
    throw error;
  }
};

// 🟢 Cancel Booking
export const removeBooking = async (id, token) => {
  try {
    await api.delete(`/user/removeBooking/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    toast.error("Failed to cancel booking");
    throw error;
  }
};

// 🟢 Favourites
export const toFav = async (id, token) => {
  try {
    await api.post(`/user/toFav/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    toast.error("Failed to update favourites");
    throw error;
  }
};

export const getAllFav = async (token) => {
  if (!token) return;
  try {
    const res = await api.get("/user/allFav", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.favResidenciesID;
  } catch (error) {
    toast.error("Failed to fetch favourites");
    throw error;
  }
};

// 🟢 Bookings
export const getAllBookings = async (token) => {
  if (!token) return;
  try {
    const res = await api.get("/user/allBookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.bookedVisits;
  } catch (error) {
    toast.error("Failed to fetch bookings");
    throw error;
  }
};

// 🟢 Create Residency
export const createResidency = async (data, token, userEmail) => {
  try {
    const res = await api.post(
      "/residency/create",
      { ...data, userEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to create residency");
    throw error;
  }
};
