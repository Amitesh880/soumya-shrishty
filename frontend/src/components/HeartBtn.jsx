import React, { useEffect } from "react";
import { useState } from "react";
import useAuthCheck from "../hooks/useAuthCheck";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useMutation } from "react-query";
import { toFav } from "../utils/api";
import { checkFavourites, updateFavourites } from "../utils/common";
 
export const HeartBtn = ({id}) => {
    const [heartColor,setHeartColor]=useState("white")
    const {validateLogin}=useAuthCheck()
    const {user}=useAuth();
  const {
    userDetails: { token, Favourites },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate} = useMutation({
    mutationFn: () => toFav(id,user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        Favourites:updateFavourites(id,prev.Favourites)
      }));
    }
  });
    const handleLike =()=>{
        if(validateLogin()){
            mutate()
            setHeartColor((prev)=>prev==="red"?"white":"red")
        }
    }
    useEffect(()=>{
       setHeartColor(()=> checkFavourites(id,Favourites))
    },[Favourites])
  return (
    <div>
        <FaHeart
        onClick={(e)=>{
            e.stopPropagation()
            handleLike()
        }}
        color={heartColor}
        size={23}
        className="cursor-pointer drop-shadow-sm"
        />
    </div>
    )
};

export default HeartBtn;