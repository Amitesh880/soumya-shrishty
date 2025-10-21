import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const residencyData = JSON.parse(readFileSync(join(__dirname, '../data/Residency.json'), 'utf8'));

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
        image: item.image,
        facilities: item.facilities || { bedrooms: 2, bathrooms: 2, parkings: 1 },
        createdAt: item.createdAt?.$date ? new Date(item.createdAt.$date) : new Date(),
        updatedAt: item.updatedAt?.$date ? new Date(item.updatedAt.$date) : new Date()
    }));
};

export const createResidency=asyncHandler(async(req,res)=>{
    console.log("Creating residency with data:", req.body);
    
    const{ title,description,price,address,country,city,facilities,image,userEmail }=req.body
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
                image: image || "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

 export const getAllResidencies=asyncHandler(async(req,res)=>{
    try {
        console.log("=== FETCHING RESIDENCIES ===");
        console.log("Request headers:", req.headers);
        console.log("Database URL status:", process.env.DATABASE_URL ? "Set" : "Not set");
        console.log("Environment:", process.env.NODE_ENV || "development");
        
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.log("❌ DATABASE_URL environment variable is not set!");
            console.log("Available environment variables:", Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('MONGO')));
            console.log("📄 Using data from Residency.json file");
            
            // Return data from JSON file when DATABASE_URL is not set
            const jsonData = transformResidencyData(residencyData);
            console.log(`✅ Returning ${jsonData.length} properties from JSON file`);
            return res.status(200).json(jsonData);
        }
        
        // Test database connection first
        await prisma.$connect();
        console.log("✅ Database connected successfully");
        console.log("Database URL (first 20 chars):", process.env.DATABASE_URL.substring(0, 20) + "...");
        
        const residencies=await prisma.residency.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        console.log(`✅ Found ${residencies.length} residencies from database`);
        
        // Log first residency for debugging
        if (residencies.length > 0) {
            console.log("First residency sample:", {
                id: residencies[0].id,
                title: residencies[0].title,
                price: residencies[0].price,
                city: residencies[0].city
            });
        }
        
        // If no residencies found, return data from JSON file
        if (residencies.length === 0) {
            console.log("⚠️ No residencies found in database, using data from Residency.json file");
            const jsonData = transformResidencyData(residencyData);
            console.log(`✅ Returning ${jsonData.length} properties from JSON file`);
            return res.status(200).json(jsonData);
        }
        
        console.log("✅ Returning", residencies.length, "residencies from database");
        res.status(200).json(residencies);
    } catch (error) {
        console.error("❌ Error fetching residencies:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Database URL available:", !!process.env.DATABASE_URL);
        
        // Return data from JSON file on error to prevent frontend crashes
        console.log("📄 Using data from Residency.json file due to database error");
        const jsonData = transformResidencyData(residencyData);
        console.log(`✅ Returning ${jsonData.length} properties from JSON file`);
        res.status(200).json(jsonData);
    }
})

export const getResidency=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    
    console.log("=== FETCHING SINGLE RESIDENCY ===");
    console.log("Residency ID:", id);

    try{
        // Handle JSON data case - check if ID exists in JSON data first
        const jsonData = transformResidencyData(residencyData);
        const jsonProperty = jsonData.find(property => property.id === id);
        
        if (jsonProperty) {
            console.log("Returning property from JSON data for ID:", id);
            return res.status(200).json(jsonProperty);
        }

        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            console.log("❌ DATABASE_URL environment variable is not set!");
            return res.status(404).json({
                success: false,
                message: "Property not found in JSON data and DATABASE_URL is not set"
            });
        }

        const residency=await prisma.residency.findUnique({where :{ id }})
        
        if (!residency) {
            console.log("❌ Residency not found for ID:", id);
            return res.status(404).json({
                success: false,
                message: "Residency not found"
            });
        }
        
        console.log("✅ Residency found:", residency.title);
        res.status(200).json(residency);
    }catch(err){
        console.error("❌ Error fetching residency:", err);
        console.error("Error details:", err.message);
        
        return res.status(500).json({
            success: false,
            message: "Failed to fetch residency",
            error: err.message
        });
    }
})
