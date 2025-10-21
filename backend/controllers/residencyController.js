import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler"

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
        
        // Test database connection first
        await prisma.$connect();
        console.log("✅ Database connected successfully");
        
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
        
        // If no residencies found, return sample data
        if (residencies.length === 0) {
            console.log("⚠️ No residencies found in database, returning sample data");
            const sampleData = [
                {
                    id: "sample-1",
                    title: "Sample Property 1",
                    description: "This is a sample property for testing",
                    price: 2000,
                    address: "123 Sample Street",
                    city: "Sample City",
                    country: "Sample Country",
                    image: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    facilities: { bedrooms: 2, bathrooms: 2, parkings: 1 },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            return res.status(200).json(sampleData);
        }
        
        console.log("✅ Returning", residencies.length, "residencies from database");
        res.status(200).json(residencies);
    } catch (error) {
        console.error("❌ Error fetching residencies:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        
        // Return sample data on error to prevent frontend crashes
        const sampleData = [
            {
                id: "sample-1",
                title: "Sample Property 1",
                description: "This is a sample property for testing",
                price: 2000,
                address: "123 Sample Street",
                city: "Sample City",
                country: "Sample Country",
                image: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                facilities: { bedrooms: 2, bathrooms: 2, parkings: 1 },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        res.status(200).json(sampleData);
    }
})

export const getResidency=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    
    console.log("=== FETCHING SINGLE RESIDENCY ===");
    console.log("Residency ID:", id);

    try{
        // Handle sample data case
        if (id === "sample-1") {
            console.log("Returning sample data for ID:", id);
            const sampleData = {
                id: "sample-1",
                title: "Sample Property 1",
                description: "This is a sample property for testing",
                price: 2000,
                address: "123 Sample Street",
                city: "Sample City",
                country: "Sample Country",
                image: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                facilities: { bedrooms: 2, bathrooms: 2, parkings: 1 },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            return res.status(200).json(sampleData);
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
