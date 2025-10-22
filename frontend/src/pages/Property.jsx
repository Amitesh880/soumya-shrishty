import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { getProperty, removeBooking } from "../utils/api";
import { PuffLoader } from "react-spinners";
import { FaStar } from "react-icons/fa";
import {
  MdLocationOn,
  MdOutlineBathtub,
  MdOutlineBed,
  MdOutlineGarage,
} from "react-icons/md";
import { CgRuler } from "react-icons/cg";
import Map from "../components/Map";
import useAuthCheck from "../hooks/useAuthCheck";
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";
import UserDetailContext from "../context/UserDetailContext";
import { toast } from "react-toastify";
import { Button } from "@mantine/core";
import HeartBtn from "../components/HeartBtn";

const Property = () => {
  const [modalOpened, setmodalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { user } = useAuth();
  const { data, isError, isLoading } = useQuery(["resd", id], () => getProperty(id));
  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));
      toast.success("Booking Cancelled", { position: "bottom-right" });
    },
  });

  if (isLoading) {
    return (
      <div className="h-64 flex justify-center">
        <PuffLoader height="80" width="80" radius={1} color="#555" aria-label="puff-loading" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-64 flex flex-col justify-center items-center">
        <span className="text-red-500 text-lg">Failed to load property</span>
        <span className="text-gray-500 text-sm mt-2">Please try again later</span>
      </div>
    );
  }

  const handleBookVisitClick = () => {
    if (isLoading) return;
    if (validateLogin()) {
      setmodalOpened(true);
    }
  };


  return (
    <section className="max-padd-container mx-[2px] my-[99px]">
      <div className="pb-2 relative">
        <img
          src={data?.image}
          alt={data?.title}
          className="rounded-tr-3xl rounded-tl-3xl max-h-[27rem] w-full object-cover aspect-square"
        />
        <div className="absolute top-8 right-8">
          <HeartBtn id={id}/>
        </div>
      </div>

      <div className="xl:flex justify-between gap-8">
        <div className="flex-1">
          <p className="flex gap-x-2">
            <MdLocationOn />
            <span>{data?.address} {data?.city} {data?.country}</span>
          </p>

          <div className="flex justify-between pt-3">
            <h4 className="font-bold text-[20px]">{data?.title || "Property Title"}</h4>
            <div className="font-bold text-[20px]">${data?.price || 0}.00</div>
          </div>

          <div className="flex justify-between py-1">
            <h5 className="bold-16 text-green-700">{data?.city}</h5>
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-[18px] text-black">5.0</h4>
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
          </div>

          <div className="flex gap-x-4">
            <div className="flex gap-x-2 border-r pr-4 font-[500]">
              <MdOutlineBed />{data?.facilities?.area || 0}
            </div>
            
            <div className="flex gap-x-2 border-r pr-4 font-[500]">
              <CgRuler />400
            </div>
          </div>

          <h4 className="h4 mt-3">Property Details</h4>
          <p className="mb-4">{data?.description}</p>

          <div className="flex justify-between pt-7">
            {bookings?.some((booking) => booking.id === id) ? (
              <>
                <Button
                  onClick={() => cancelBooking()}
                  variant="outline"
                  w="100%"
                  color="red"
                  disabled={cancelling}
                >
                  Cancel Booking
                </Button>
                <p className="text-red-500 medium-15 ml-3">
                  You've already booked for {
                    bookings.find((booking) => booking.id === id)?.date
                  }
                </p>
              </>
            ) : (
              <Button
                onClick={handleBookVisitClick}
                disabled={isLoading}
                variant="filled"
                w="50%"
                color="black"
              >
                Book visit
              </Button>
            )}

            <BookingModal
              opened={modalOpened}
              setopened={setmodalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>
        </div>

        <div className="flex-1">
          <Map address={data?.address} city={data?.city} country={data?.country} />
        </div>
      </div>
    </section>
  );
};

export default Property;