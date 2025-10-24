import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { getProperty, removeBooking } from "../utils/api";
import { PuffLoader } from "react-spinners";
import { FaStar, FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import {
  MdLocationOn,
  MdSquareFoot,
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
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

  // Get media array, fallback to single image if media doesn't exist
  const getMediaArray = () => {
    if (data?.media && Array.isArray(data.media) && data.media.length > 0) {
      return data.media;
    }
    // Fallback for old data structure
    if (data?.image) {
      return [{ type: "image", url: data.image, alt: data.title }];
    }
    return [];
  };

  const mediaArray = getMediaArray();

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === mediaArray.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? mediaArray.length - 1 : prev - 1
    );
  };

  const currentMedia = mediaArray[currentMediaIndex];


  return (
    <section className="max-padd-container mx-[2px] my-[99px]">
      <div className="pb-2 relative">
        {/* Media Gallery */}
        <div className="relative rounded-tr-3xl rounded-tl-3xl min-h-[27rem] w-full overflow-hidden">
          {currentMedia ? (
            currentMedia.type === "video" ? (
              <video
                src={currentMedia.url}
                alt={currentMedia.alt || data?.title}
                className="w-full h-full object-cover aspect-square"
                controls
                poster={currentMedia.thumbnail}
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.alt || data?.title}
                className="w-full h-full object-cover aspect-square"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-square">
              <span className="text-gray-500">No media available</span>
            </div>
          )}
          
          {/* Navigation arrows */}
          {mediaArray.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronRight />
              </button>
            </>
          )}
          
          {/* Media counter */}
          {mediaArray.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentMediaIndex + 1} / {mediaArray.length}
            </div>
          )}
          
          {/* Video play indicator */}
          {currentMedia?.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-30 rounded-full p-4">
                <FaPlay className="text-white text-2xl ml-1" />
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute top-8 right-8">
          <HeartBtn id={id}/>
        </div>
        
        {/* Thumbnail strip */}
        {mediaArray.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {mediaArray.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentMediaIndex ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                {media.type === "video" ? (
                  <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaPlay className="text-gray-600" />
                    {media.thumbnail && (
                      <img
                        src={media.thumbnail}
                        alt={media.alt}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="xl:flex justify-between gap-8">
        <div className="flex-1">
          <p className="flex gap-x-2">
            <MdLocationOn />
            <span>{data?.address} {data?.city} {data?.country}</span>
          </p>

          <div className="flex justify-between pt-3">
            <h4 className="font-bold text-[20px]">{data?.title || "Property Title"}</h4>
            <div className="font-bold text-[20px]">₹ {data?.price || 0}.00</div>
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
              <MdSquareFoot />{data?.facilities?.area || 0}
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