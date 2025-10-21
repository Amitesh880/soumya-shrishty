import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler"

export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user");
    let { email } = req.body
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body })
        res.send({
            message: "User registered successfully",
            user: user,
        })
    }
    else res.status(201).send({ message: "User already registered" })

})

import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";

export const bookVisit = asyncHandler(async (req, res) => {
  const email = req.auth?.email;
  const { date } = req.body;
  const { id } = req.params;

  if (!email) {
    return res.status(401).json({ message: "Unauthorized: Missing user email from token" });
  }

  if (!date || !id) {
    return res.status(400).json({ message: "Missing booking date or residency ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyBooked = user.bookedVisits.some((visit) => visit.id === id);

    if (alreadyBooked) {
      return res.status(400).json({ message: "This residency is already booked by you" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        bookedVisits: { push: { id, date } }
      }
    });

    res.status(200).json({ message: "Your visit is booked successfully" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const allBookings = asyncHandler(async (req, res) => {
    const email = req.auth?.email
    try {
        const bookings = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })

        res.status(200).send(bookings)
    } catch (err) {
        throw new Error(err.message)
    }
})

export const cancelBooking = asyncHandler(async (req, res) => {
    const email = req.auth?.email
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })
        const index = user.bookedVisits.findIndex((visit) => visit.id === id)
        if (index === -1) {
            res.status(404).json({ message: "Booking not found" })
        } else {
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: user.bookedVisits
                }
            })
            res.send("Booking cancelled successfully")
        }
    } catch (err) {
        throw new Error(err.message)
    }
})

export const toFav = asyncHandler(async (req, res) => {
    const email = req.auth?.email
    const { rid } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            })
            res.send({ message: "Removed from Favourite", user: updateUser })
        } else {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            })
            res.send({ message: "Updated Favourites", user: updateUser })
        }
    } catch (err) {
        throw new Error(err.message)
    }

})


export const getAllFav=asyncHandler(async(req,res)=>{
    const email = req.auth?.email
    try{
        const favResd=await prisma.user.findUnique({
            where: { email },
            select: { favResidenciesID:true}
        })
        res.status(200).send(favResd)
    }catch(err){
        throw new Error(err.message)
    }
})
