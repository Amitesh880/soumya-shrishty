import React, { useState, useContext } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";

import UserDetailContext from "../context/UserDetailContext";
import { bookVisit } from "../utils/api";

const BookingModal = ({ opened, setopened, propertyId }) => {
  const [value, setvalue] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const { userDetails, setUserDetails } = useContext(UserDetailContext);

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
    mutationFn: async () => {
      const token = await getAccessTokenSilently();
      return bookVisit(value, propertyId, token); // no email passed
    },
    onSuccess: handleBookingSuccess,
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