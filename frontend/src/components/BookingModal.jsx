import React, { useState, useContext } from "react";
import { Modal, Button } from "@mantine/core";
import UserDetailContext from "../context/UserDetailContext";
import { useMutation } from "react-query";
import { DatePicker } from "@mantine/dates";
import { bookVisit } from "../utils/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const BookingModal = ({ opened, setopened, propertyId, email }) => {
  const [value, setvalue] = useState(null);
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
    mutationFn: () => bookVisit(value, propertyId, email, token),
    onSuccess: () => handleBookingSuccess(),
    onError: (error) => {
      const message = error?.response?.data?.message || "Booking failed";
      toast.error(message, { position: "bottom-right" });
    },
    onSettled: () => setopened(false),
  });

  return (
    <Modal opened={opened} onClose={() => setopened(false)} title="Book a Visit" centered>
      <div className="flex justify-center flex-col gap-4">
        <DatePicker value={value} onChange={setvalue} minDate={new Date()} />
        <Button disabled={!value || isLoading} onClick={() => mutate()}>
          Book Visit
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;