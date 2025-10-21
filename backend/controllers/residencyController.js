import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler"

export const createResidency=asyncHandler(async(req,res)=>{
    const{ title,description,price,address,country,city,facilities,image }=req.body.data || req.body
    const userId = req.userId

    console.log(req.body.data)
    try{
        const residency=await prisma.residency.create({
            data:{
                title,
                description,
                price,
                address,
                country,
                city,
                facilities,
                image,
                owner :{connect:{id:userId}} 
            }
        })

        res.send({message:"Residency created successfully",residency})
    }catch(err){
        if(err.code==="P2002"){
            throw new Error("Already have a residency with this address")
        }
        throw new Error(err.message)
    }
    
})

 export const getAllResidencies=asyncHandler(async(req,res)=>{
    const residencies=await prisma.residency.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })
    res.send(residencies)
})

export const getResidency=asyncHandler(async(req,res)=>{
    const { id }=req.params;

    try{
        const residency=await prisma.residency.findUnique({where :{ id }})
        res.send(residency)
    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
})
