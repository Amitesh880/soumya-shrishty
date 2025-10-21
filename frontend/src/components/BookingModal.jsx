import React, { useState, useContext } from "react";
import { Modal, Button } from "@mantine/core";
import UserDetailContext from "../context/UserDetailContext";
import { useMutation } from "react-query";
import { DatePicker } from "@mantine/dates";
import { bookVisit } from "../utils/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

const BookingModal = ({ opened, setopened, propertyId, email }) => {
  const [value, setvalue] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const {
    userDetails: { token },
    setUserDetails,
  } = useContext(UserDetailContext);

  const handleBookingSuccess = () => {
    toast.success("You have booked a visit successfully", {
      position: "bottom-right",
    });

    setUserDetails((prev) => ({
      ...prev,
      bookings: [
        ...(Array.isArray(prev.bookings) ? prev.bookings : []),
        {
          id: propertyId,
          date: dayjs(value).format("DD-MM-YYYY"),
        },
      ],
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      console.log("BookingModal - Token value:", token);
      console.log("BookingModal - Token type:", typeof token);
      console.log("BookingModal - Token length:", token?.length);
      
      if (!isAuthenticated) {
        toast.error("Please log in to book a visit", { position: "bottom-right" });
        loginWithRedirect();
        throw new Error("User not authenticated");
      }
      
      if (!token) {
        toast.error("Authentication token not available. Please try logging in again.", { position: "bottom-right" });
        loginWithRedirect();
        throw new Error("No authentication token available");
      }
      
      return bookVisit(value, propertyId, email, token);
    },
    onSuccess: () => handleBookingSuccess(),
    onError: (error) => {
      console.error("Booking error details:", error);
      const message = error?.response?.data?.message || error?.message || "Booking failed";
      toast.error(message, { position: "bottom-right" });
    },
    onSettled: () => setopened(false),
  });

  return (
    <Modal opened={opened} onClose={() => setopened(false)} title="Book a Visit" centered>
      <div className="flex justify-center flex-col gap-4">
        <DatePicker value={value} onChange={setvalue} minDate={new Date()} />
        <Button disabled={!value || isLoading || !token || !isAuthenticated} onClick={() => mutate()}>
          {!isAuthenticated ? "Please log in" : !token ? "Loading authentication..." : "Book Visit"}
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;