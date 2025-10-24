import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'


// Helper function to transform JSON data to frontend format
const transformResidencyData = (data) => {
    return data.map(item => ({
        id: item._id?.$oid || item._id || `fallback-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title,
        description: item.description,
        price: item.price,
        address: item.address,
        city: item.city,
        country: item.country,
        media: item.media || (item.image ? [{type: "image", url: item.image, alt: item.title}] : []),
        facilities: item.facilities || { bedrooms: 2, bathrooms: 2, parkings: 1 },
        createdAt: item.createdAt?.$date ? new Date(item.createdAt.$date) : new Date(),
        updatedAt: item.updatedAt?.$date ? new Date(item.updatedAt.$date) : new Date()
    }));
};

export const createResidency=asyncHandler(async(req,res)=>{
    console.log("Creating residency with data:", req.body);
    
    const{ title,description,price,address,country,city,facilities,media,userEmail }=req.body
    const userId = req.userId

    console.log("User ID:", userId);
    console.log("User Email:", userEmail);
    
    // Validate required fields
    if (!title || !description || !price || !address || !country || !city) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    // Default media if none provided
    const defaultMedia = [{
        type: "image",
        url: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Default property image"
    }];

    try{
        const residency=await prisma.residency.create({
            data:{
                title,
                description,
                price: parseInt(price),
                address,
                country,
                city,
                facilities: facilities || {},
                media: media || defaultMedia,
                ownerId: userId
            }
        })

        console.log("Residency created successfully:", residency);
        res.status(201).json({
            success: true,
            message: "Residency created successfully",
            residency
        });
    }catch(err){
        console.error("Error creating residency:", err);
        if(err.code==="P2002"){
            return res.status(400).json({
                success: false,
                message: "Already have a residency with this address"
            });
        }
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to create residency"
        });
    }
    
})

 const __filename = fileURLToPath(import.meta.url)
 const __dirname = path.dirname(__filename)
 const RESD_JSON_PATH = path.join(__dirname, '..', 'data', 'Residency.json')
 export const getAllResidencies=asyncHandler(async(req,res)=>{
     try {
         await prisma.$connect();
         const rawResidencies = await prisma.residency.findRaw({
             filter: {}
         });
     
         const normalizeObjectId = (val) => {
             if (!val) return undefined;
             if (typeof val === "string") return val;
             if (typeof val === "object" && "$oid" in val) return val.$oid;
             if (typeof val.toString === "function") {
                 const str = val.toString();
                 return str !== "[object Object]" ? str : undefined;
             }
             return undefined;
         };
     
         const residencies = rawResidencies.map((doc) => ({
             id: normalizeObjectId(doc._id),
             title: doc.title,
             description: doc.description,
             price: doc.price,
             address: doc.address,
             city: doc.city,
             country: doc.country,
             media: doc.media || (doc.image ? [{type: "image", url: doc.image, alt: doc.title}] : []),
             facilities: doc.facilities || {},
             createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
             updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
         }));
     
         res.status(200).json(residencies);
     } catch (error) {
         return res.status(500).json({
             success: false,
             message: "Failed to fetch residencies",
             error: error.message
         })
     }
 })

 export const getResidency=asyncHandler(async(req,res)=>{
     const { id } = req.params;
 
     try {
         await prisma.$connect();
         const raw = await prisma.residency.findRaw({
             filter: { _id: { $oid: String(id) } }
         });
 
         if (!Array.isArray(raw) || raw.length === 0) {
             return res.status(404).json({ success: false, message: "Residency not found" });
         }
 
         const doc = raw[0];
         const normalizeObjectId = (val) => {
             if (!val) return undefined;
             if (typeof val === "string") return val;
             if (typeof val === "object" && "$oid" in val) return val.$oid;
             if (typeof val.toString === "function") {
                 const str = val.toString();
                 return str !== "[object Object]" ? str : undefined;
             }
             return undefined;
         };
 
         const residency = {
             id: normalizeObjectId(doc._id),
             title: doc.title,
             description: doc.description,
             price: doc.price,
             address: doc.address,
             city: doc.city,
             country: doc.country,
             media: doc.media || (doc.image ? [{type: "image", url: doc.image, alt: doc.title}] : []),
             facilities: doc.facilities || {},
             ownerId: normalizeObjectId(doc.ownerId),
             createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
             updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
         };
 
         res.status(200).json(residency);
     } catch (err) {
         return res.status(500).json({
             success: false,
             message: "Failed to fetch residency",
             error: err.message
         })
     }
 })
